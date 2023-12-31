import { AbstractLoader, LoaderOptions } from "../../Loader";
import { compile, Environment, FileSystemLoader } from "nunjucks";
import { existsSync } from "fs";
import { readText, isFunction, isObject } from "noka-util";
import { ContainerLike, Inject, InjectMeta } from "../../Container";
import { HttpResult } from "../../Application";

const ViewBeanKey = Symbol("View");

export type ViewLoaderOptions = LoaderOptions<{
  extname?: string;
}>;

type ViewMap = Record<string, (data: any) => string>;

export class ViewLoader extends AbstractLoader<ViewLoaderOptions> {
  /**
   * 加载所有视图
   */
  public async load() {
    const { targetDir = "app:/views", extname = ".html" } = this.options;
    const viewDir = this.app.resolvePath(targetDir);
    if (!existsSync(viewDir)) return;
    const viewFiles = await this.glob(`./**/*${extname}`);
    const viewMap: ViewMap = {};
    const env = new Environment(new FileSystemLoader(viewDir));
    await Promise.all(
      viewFiles.map(async (viewFile) => {
        const text = await readText(viewFile);
        // @types/nunjucks 3.1.1 没有第三个 path 参数的类型定义
        const relativePath: any = viewFile;
        const template = compile(text, env, relativePath);
        const viewName = viewFile
          .slice(viewDir.length)
          .slice(0, -extname.length)
          .replace(/\\/g, "/");
        viewMap[viewName] = (data: any) => template.render(data);
      }),
    );
    this.app.container.register(ViewBeanKey, { type: "value", value: viewMap });
    this.app.devTool.watchDir(viewDir);
    this.app.logger?.info("View ready");
  }
}

/**
 * 视图注入处理函数
 * @param options 注入选项
 */
function viewInjectHandler(
  container: ContainerLike,
  meta: InjectMeta,
  instance: unknown,
  method: unknown,
) {
  const views = container.get<ViewMap>(ViewBeanKey) || {};
  const name = String(meta.name);
  const render = views[name] || views[`/${name}`];
  if (!render || !isFunction(render)) throw new Error(`Invalid View: ${name}`);
  if (!method || !isFunction(method)) return render(method);
  return async (...args: any[]) => {
    const $context = args[args.length - 1];
    const result = await method.call(instance, ...args);
    if (HttpResult.is(result)) {
      const data = isObject(result.body)
        ? { ...result.body, $context }
        : { $context };
      result.body = await render(data);
      return result;
    }
    return render({ result, $context });
  };
}

/**
 * 或 controller 注入视图
 * @param name 视图名称
 */
export function View(name: string) {
  return Inject(name, { handle: viewInjectHandler });
}
