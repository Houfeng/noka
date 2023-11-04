import globby from "globby";
import { existsSync } from "fs";
import { ApplicationLike } from "../Application/ApplicationLike";
import { LoaderInstance } from "./LoaderInstance";
import { isString } from "ntils";
import { readText, writeText } from "noka-utility";
import { FSWatcher, watch, WatchOptions } from "chokidar";
import { LoaderOptions } from "./LoaderOptions";

type Exports = Record<string, unknown>;

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
  protected glob(path: string | string[], options?: globby.GlobbyOptions) {
    const paths = Array.isArray(path) ? path : [path];
    const cwd = this.app.rootDir;
    const selector = paths.map((it) => this.app.resolvePath(it));
    return globby(selector, { cwd, ...options });
  }

  /**
   * 导入一个模块
   * @param moduleFile 模块路径
   */
  protected importModule<M = Exports>(moduleFile: string): M | undefined {
    try {
      return require(this.app.resolvePath(moduleFile));
    } catch {
      return;
    }
  }

  private watcher?: FSWatcher;

  /**
   * 在通过 noka-cli 启动时，可通过此方法监听指定的文件，并自动重启进程
   * 在非 noka-cli 启动时，此方法将不会起任何作用
   * 请不用将 .js 和 .ts 文件传给此方法，因为代码文件默认就会自动重启
   * @param paths 文件（file, dir, glob, or array）
   */
  protected watch(paths: string | string[], options?: WatchOptions): void {
    if (!this.app.isLaunchSourceCode) return;
    this.unWatch();
    this.watcher = watch(paths, { ...options, ignoreInitial: true });
    this.watcher.on("all", this.requestAppRestart);
  }

  protected unWatch() {
    if (!this.watcher) return;
    this.watcher.off("all", this.requestAppRestart);
    this.watcher = undefined;
  }

  /**
   * 请求 app 进行重启
   */
  protected requestAppRestart = async () => {
    if (!this.app.isLaunchSourceCode) return;
    const text = await readText(this.app.entry);
    if (!text) return;
    return writeText(this.app.entry, text);
  };

  /**
   * 已加载的资源或类型列表
   */
  protected items: C[] = [];

  /**
   * 加载通过 path 指定的内容
   */
  protected async loadModules(): Promise<C[]> {
    const { rootDir } = this.app;
    if (!existsSync(rootDir)) return [];
    const { path } = this.options;
    if (!isString(path)) return [];
    const moduleFiles = await this.glob(path);
    const items: C[] = [];
    moduleFiles.forEach((moduleFile) => {
      const fileExports = this.importModule(moduleFile);
      if (!fileExports) return;
      Object.keys(fileExports).forEach((name) => {
        const mod: any = fileExports[name];
        // only debug
        mod.__file__ = moduleFile;
        items.push(mod);
      });
    });
    return items;
  }

  /**
   * 由应用调用的 load 方法
   */
  async load() {
    this.items = await this.loadModules();
  }

  /**
   * 由应用调用的 unload 方法
   */
  async unload() {
    this.unWatch();
  }
}
