import * as globby from "globby";
import { AbstractLoader } from "../AbstractLoader";
import { basename, resolve } from "path";
import { compile, Environment, FileSystemLoader } from "nunjucks";
import { existsSync } from "fs";
import { readText } from "../common/utils";
import { VIEWS_ENTITY_KEY } from "./constants";

/**
 * 静态资源 加载器
 */
export class ViewLoader<T = any> extends AbstractLoader<T> {
  /**
   * 加载所有视图
   */
  public async load() {
    const { path, extname = ".html" } = this.options;
    const viewRoot = resolve(this.root, path);
    if (!existsSync(viewRoot)) return;
    const viewPattern = `./**/*${extname}`;
    const viewFiles = await globby(viewPattern, { cwd: viewRoot });
    const viewMap: any = {};
    const env = new Environment(new FileSystemLoader(viewRoot));
    await Promise.all(
      viewFiles.map(async file => {
        const text = await readText(resolve(viewRoot, file));
        // @types/nunjucks 3.1.1 没有第三个 path 参数的类型定义
        const relativePath: any = file;
        const template = compile(text, env, relativePath);
        viewMap[basename(file, extname)] = (data: any) => template.render(data);
      })
    );
    this.container.registerValue(VIEWS_ENTITY_KEY, viewMap);
    this.watchBy(viewPattern, { cwd: viewRoot });
    this.app.logger.info("View ready");
  }
}
