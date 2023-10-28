/** @format */

import globby from "globby";
import { existsSync } from "fs";
import { extname, normalize, resolve } from "path";
import { ApplicationInterface } from "../Application/ApplicationInterface";
import { LoaderInstance } from "./LoaderInstance";
import { isArray, isString } from "ntils";
import { readText, writeText } from "../common/utils";
import { watch, WatchOptions } from "chokidar";
import { LoaderOptions } from "./LoaderOptions";

type TSConfig = {
  rootDir: string;
  outDir: string;
};

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
  constructor(protected app: ApplicationInterface, protected options: T) {
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
  protected get home() {
    return this.app.home;
  }

  /**
   * 已加载的资源或类型列表
   */
  protected content: C[] = [];

  /**
   * 获取工程源码目录
   */
  protected get sourceDir(): string {
    const tsconfig = this.importModule<TSConfig>("./tsconfig.json");
    return (tsconfig && tsconfig.rootDir) || "src";
  }

  /**
   * 获取工程构建结果目录
   */
  protected get distDir(): string {
    const tsconfig = this.importModule<TSConfig>("./tsconfig.json");
    return (tsconfig && tsconfig.outDir) || "dist";
  }

  /**
   * 运行时的临时输出信息目录
   */
  protected get tempDir(): string {
    return this.resolvePath("./temp");
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
    path = normalize(path.replace("~/", this.home + "/"));
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
  protected importModule<M = Exports>(moduleFile: string): M {
    try {
      return require(this.resolvePath(moduleFile));
    } catch {
      return null;
    }
  }

  /**
   * 是否是开发模式
   */
  protected get isDevelopment() {
    return this.app.isDevelopment;
  }

  /**
   * 在通过 noka-cli 启动时，可通过此方法监听指定的文件，并自动重启进程
   * 在非 noka-cli 启动时，此方法将不会起任何作用
   * 请不用将 .js 和 .ts 文件传给此方法，因为代码文件默认就会自动重启
   * @param paths 文件（file, dir, glob, or array）
   */
  protected watchBy(paths: string | string[], options?: WatchOptions): void {
    if (!this.isDevelopment) return;
    const watcher = watch(paths, { ...options, ignoreInitial: true });
    watcher.on("all", this.triggerRestart);
  }

  /**
   * 通过读写 entry 触发 dev 模式的进程重启
   */
  protected triggerRestart = async () => {
    const text = await readText(this.app.entry);
    return writeText(this.app.entry, text);
  };

  /**
   * 加载相关的内容
   * @param app 全局应用程序实例
   */
  public async load() {
    const { root } = this.app;
    if (!existsSync(root)) return;
    const { path } = this.options;
    if (!isString(path)) return;
    const moduleFiles = await this.glob(path);
    moduleFiles.forEach((moduleFile) => {
      const modules = this.importModule(moduleFile);
      if (!modules) return;
      Object.keys(modules).forEach((name) => {
        const mod: any = modules[name];
        mod.__file__ = moduleFile;
        this.content.push(mod);
      });
    });
  }
}
