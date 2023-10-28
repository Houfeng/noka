import globby from "globby";
import { AbstractLoader } from "../../Loader";
import { compile, Environment, FileSystemLoader } from "nunjucks";
import { existsSync } from "fs";
import { IViewLoaderOptions } from "./IViewLoaderOptions";
import { normalize, resolve } from "path";
import { readText } from "../../common/utils";
import { VIEWS_ENTITY_KEY } from "./constants";

/**
 * 静态资源 加载器
 */
export class ViewLoader<
  T extends IViewLoaderOptions = IViewLoaderOptions,
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
    const viewMap: any = {};
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
    this.container.registerValue(VIEWS_ENTITY_KEY, viewMap);
    this.watchBy(viewPattern, { cwd: viewRoot });
    this.app.logger.info("View ready");
  }
}
