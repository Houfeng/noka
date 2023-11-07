import globby from "globby";
import { AbstractLoader, LoaderOptions } from "../../Loader";
import { compile, Environment, FileSystemLoader } from "nunjucks";
import { existsSync } from "fs";
import { resolve } from "path";
import { readText } from "noka-utility";
import { getByPath } from "noka-utility";
import { ContainerLike, Inject, InjectMeta } from "../../Container";
import { isFunction } from "noka-utility";

const ViewBeanKey = Symbol("View");

export type ViewLoaderOptions = LoaderOptions<{
  extname?: string;
}>;

export class ViewLoader extends AbstractLoader<ViewLoaderOptions> {
  /**
   * 加载所有视图
   */
  public async load() {
    const { path = "", extname = ".html" } = this.options;
    const viewRoot = this.app.resolvePath(path);
    if (!existsSync(viewRoot)) return;
    const viewPattern = `./**/*${extname}`;
    const viewFiles = await globby(viewPattern, { cwd: viewRoot });
    const viewMap: Record<string, (data: any) => string> = {};
    const env = new Environment(new FileSystemLoader(viewRoot));
    await Promise.all(
      viewFiles.map(async (viewFile) => {
        const text = await readText(resolve(viewRoot, viewFile));
        // @types/nunjucks 3.1.1 没有第三个 path 参数的类型定义
        const relativePath: any = viewFile;
        const template = compile(text, env, relativePath);
        const viewName = viewFile.slice(0, viewFile.length - extname.length);
        viewMap[viewName] = (data: any) => template.render(data);
      }),
    );
    this.app.container.register(ViewBeanKey, {
      type: "value",
      value: viewMap,
    });
    this.watch(viewPattern, { cwd: viewRoot });
    this.app.logger?.info("View ready");
  }

  async unload(): Promise<void> {
    this.unWatch();
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
  originMethod: unknown,
) {
  const views = container.get(ViewBeanKey);
  const render = getByPath(views, String(meta.name));
  return !originMethod || !isFunction(originMethod)
    ? render
    : async (...args: any[]) =>
        render(await originMethod.call(instance, ...args));
}

/**
 * 或 controller 注入视图
 * @param name 视图名称
 */
export function View(name: string) {
  return Inject(name, { handle: viewInjectHandler });
}
