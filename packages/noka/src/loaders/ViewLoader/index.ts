import { AbstractLoader, LoaderOptions } from "../../Loader";
import { compile, Environment, FileSystemLoader } from "nunjucks";
import { existsSync } from "fs";
import { basename } from "path";
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
    const { targetDir = "app:/views" } = this.options;
    const viewDir = this.app.resolvePath(targetDir);
    if (!existsSync(viewDir)) return;
    const viewFiles = await this.glob("./**/*.html");
    const viewMap: Record<string, (data: any) => string> = {};
    const env = new Environment(new FileSystemLoader(viewDir));
    await Promise.all(
      viewFiles.map(async (viewFile) => {
        const text = await readText(viewFile);
        // @types/nunjucks 3.1.1 没有第三个 path 参数的类型定义
        const relativePath: any = viewFile;
        const template = compile(text, env, relativePath);
        const viewName = basename(viewFile, ".html");
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
  originMethod: unknown,
) {
  const views = container.get(ViewBeanKey);
  const name = String(meta.name);
  const render = getByPath(views, name);
  if (!render) throw new Error(`View not found: ${name}`);
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
