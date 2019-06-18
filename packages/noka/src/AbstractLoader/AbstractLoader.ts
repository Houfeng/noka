import * as globby from "globby";
import { existsSync } from "fs";
import { extname, normalize, resolve } from "path";
import { homedir } from "os";
import { IApplication } from "../Application/IApplication";
import { ILoader } from "./ILoader";
import { ILoaderOptions } from "./ILoaderOptions";
import { isArray } from "util";
import { WatchOptions } from "chokidar";

/**
 * 资源加载器抽象基类
 */
export abstract class AbstractLoader<T = any> implements ILoader<T> {
  /**
   * 通过 path 声明一个加载器实例
   * @param options 路径或匹配表达式
   */
  constructor(protected app: IApplication, protected options: ILoaderOptions) {
    this.options = { ...options };
  }

  /**
   * Koa 实例
   */
  protected get server() {
    return this.app.server;
  }

  /**
   * IoC 容器
   */
  protected get container() {
    return this.app.container;
  }

  /**
   * 应用根目录
   */
  protected get root() {
    return this.app.root;
  }

  /**
   * 环境标识
   */
  protected get env() {
    return this.app.env;
  }

  /**
   * app 在 home 中的位置
   */
  protected get homeOfApp() {
    return normalize(`${homedir()}/${this.app.name}`);
  }

  /**
   * 已加载的资源或类型列表
   */
  protected content: T[] = [];

  /**
   * 获取工程源码目录
   */
  protected get sourceDir(): string {
    const tsconfig = this.importModule("./tsconfig.json");
    return (tsconfig && tsconfig.rootDir) || "src";
  }

  /**
   * 获取工程构建结果目录
   */
  protected get distDir(): string {
    const tsconfig = this.importModule("./tsconfig.json");
    return (tsconfig && tsconfig.outDir) || "dist";
  }

  /**
   * 解析路径中的动态占位符
   * @param path 路径
   */
  protected parsePath(path: string) {
    if (!path) return;
    const ext = extname(this.app.entry);
    const src = ext === ".ts" ? this.sourceDir : this.distDir;
    return normalize(path.replace(":src", src).replace(":ext", ext));
  }

  /**
   * 解析路径中的动态占位符
   * @param paths 路径数组
   */
  protected parsePaths(paths: string[] | string) {
    return isArray(paths)
      ? paths.map((path: string) => this.parsePath(path))
      : this.parsePath(paths);
  }

  /**
   * 解析为对象路径
   * @param path 相对路径
   * @param options 选项
   */
  protected resolvePath(path: string) {
    if (!path) return;
    path = normalize(path.replace("~/", this.homeOfApp + "/"));
    return resolve(this.root, this.parsePath(path));
  }

  /**
   * 解析为对象路径
   * @param paths 相对路径
   * @param options 选项
   */
  protected resolvePaths(paths: string[] | string) {
    return isArray(paths)
      ? paths.map((path: string) => this.resolvePath(path))
      : this.resolvePath(paths);
  }

  /**
   * 获取匹配的文件
   * @param paths 匹配表达式
   * @param options 匹配选项
   */
  protected glob(paths: string | string[], options?: globby.GlobbyOptions) {
    const cwd = this.root;
    return globby(this.parsePaths(paths), { cwd, ...options });
  }

  /**
   * 导入一个模块
   * @param moduleFile 模块路径
   */
  protected importModule(moduleFile: string) {
    try {
      return require(this.resolvePath(moduleFile));
    } catch {
      return null;
    }
  }

  /**
   * 在通过 noka-cli 启动时，可通过此方法监听指定的文件，并自动重启进程
   * 在非 noka-cli 启动时，此方法将不会起任何作用
   * 请不用将 .js 和 .ts 文件传给此方法，因为代码文件默认就会自动重启
   * @param paths 文件（file, dir, glob, or array）
   */
  public watchBy(paths: string | string[], options?: WatchOptions): void {
    this.app.watchBy(paths, options);
  }

  /**
   * 加载相关的内容
   * @param app 全局应用程序实例
   */
  public async load<T>() {
    const { root } = this.app;
    if (!existsSync(root)) return;
    const { path } = this.options;
    const moduleFiles = await this.glob(path);
    moduleFiles.forEach(moduleFile => {
      const types = this.importModule(moduleFile);
      if (!types) return;
      Object.keys(types).forEach(name => this.content.push(types[name]));
    });
  }
}
