import globby, { GlobbyOptions } from "globby";
import { ApplicationLike } from "../Application/ApplicationLike";
import { LoaderInstance } from "./LoaderInstance";
import { isFunction } from "noka-util";
import { LoaderOptions } from "./LoaderOptions";
import { setFileMeta } from "./FileMetadata";
import { resolve } from "path";

type ModuleExports = Record<string, unknown>;

/**
 * 资源加载器抽象基类
 */
export abstract class AbstractLoader<
  T extends LoaderOptions = LoaderOptions,
  C = unknown,
> implements LoaderInstance
{
  /**
   * 通过 path 声明一个加载器实例
   * @param options 路径或匹配表达式
   */
  constructor(
    protected app: ApplicationLike,
    protected options: T,
  ) {
    this.options = { ...options };
  }

  /**
   * 获取匹配的文件
   * @param paths 匹配表达式
   * @param options 匹配选项
   */
  protected async glob(pattern: string | string[], options?: GlobbyOptions) {
    const { targetDir } = this.options;
    const cwd = targetDir ? this.app.resolvePath(targetDir) : this.app.rootDir;
    if (!cwd.startsWith(this.app.rootDir)) return [];
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const selector = patterns.map((it) => this.app.parsePath(it));
    const paths = await globby(selector, { ...options, cwd });
    return paths.map((it) => resolve(cwd, it));
  }

  /**
   * 导入一个模块
   * @param moduleFile 模块路径
   */
  protected loadModule<M = ModuleExports>(moduleFile: string): M | undefined {
    try {
      return this.app.require(this.app.resolvePath(moduleFile));
    } catch {
      return;
    }
  }

  /**
   * 加载通过 path 指定的内容
   */
  protected async loadModules(
    pattern: string | string[] = "./**/*:bin",
    options?: GlobbyOptions,
  ): Promise<C[]> {
    const moduleFiles = await this.glob(pattern, options);
    const items: C[] = [];
    moduleFiles.forEach((moduleFile) => {
      const fileExports = this.loadModule(moduleFile);
      if (!fileExports) return;
      Object.keys(fileExports).forEach((name) => {
        const mod: any = fileExports[name];
        items.push(mod);
        if (isFunction(mod)) setFileMeta(mod, { path: moduleFile });
      });
    });
    return items;
  }

  /**
   * 由应用调用的 load 方法
   */
  async load() {}

  /**
   * 由应用调用的 load 方法
   */
  async launch() {}

  /**
   * 由应用调用的 unload 方法
   */
  async unload() {}
}
