import globby from "globby";
import { AbstractLoader } from "../../Loader";
import { compile, Environment, FileSystemLoader } from "nunjucks";
import { existsSync } from "fs";
import { normalize, resolve } from "path";
import { readText } from "../../common/utils";
import { getByPath } from "../../common/utils";
import { ContainerType, Inject, InjectPropMetadata } from "../../Container";
import { isFunction } from "ntils";

const VIEWS_ENTITY_KEY = Symbol("VIEWS_ENTITY_KEY");

export type ViewLoaderOptions = {
  path?: string;
  extname?: string;
}

/**
 * 静态资源 加载器
 */
export class ViewLoader<
  T extends ViewLoaderOptions = ViewLoaderOptions,
> extends AbstractLoader<{ path: string; extname: string }, T> {
  /**
   * 加载所有视图
   */
  public async load() {
    const { path, extname = ".html" } = this.options;
    const viewRoot = normalize(resolve(this.root, path));
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
    this.container.register(VIEWS_ENTITY_KEY, { type: 'value', value: viewMap });
    this.watchBy(viewPattern, { cwd: viewRoot });
    this.app.logger.info('View root:', viewRoot);
    this.app.logger.info("View ready");
  }
}


/**
 * 视图注入处理函数
 * @param options 注入选项
 */
export function viewInjectHandler(
  container: ContainerType,
  meta: InjectPropMetadata,
  instance: unknown,
  originMethod: unknown
) {
  const views = container.get(VIEWS_ENTITY_KEY);
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
