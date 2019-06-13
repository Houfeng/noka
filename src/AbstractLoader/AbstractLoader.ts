import * as globby from "globby";
import { existsSync } from "fs";
import { extname, normalize, resolve } from "path";
import { IApplication } from "../Application/IApplication";
import { ILoader } from "./ILoader";
import { ILoaderOptions } from "./ILoaderOptions";
import { isArray } from "util";

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
   * 已加载的资源或类型列表
   */
  protected content: T[] = [];

  /**
   * 获取工程源码目录
   */
  protected get sourceDir(): string {
    const tsconfig = this.require("./tsconfig.json");
    return (tsconfig && tsconfig.rootDir) || "src";
  }

  /**
   * 获取工程构建结果目录
   */
  protected get distDir(): string {
    const tsconfig = this.require("./tsconfig.json");
    return (tsconfig && tsconfig.outDir) || "dist";
  }

  /**
   * 将匹配一个表达式字符串规范化
   * @param path 匹配表达式
   */
  protected normalizePath(path: string): string {
    const ext = extname(this.app.entry);
    const src = ext === ".ts" ? this.sourceDir : this.distDir;
    return normalize(path.replace(":src", src).replace(":ext", ext));
  }

  /**
   * 规范化匹配表达式字符串
   * @param paths 匹配表达式
   */
  protected normalizePaths(paths: string[] | string): string[] | string {
    return isArray(paths)
      ? paths.map((path: string) => this.normalizePath(path))
      : this.normalizePath(paths);
  }

  /**
   * 解析为对象路径
   * @param path 相对路径
   * @param options 选项
   */
  protected resolvePath(path: string, options?: { normalize: boolean }) {
    const resolvedPath = resolve(this.root, path);
    return options && options.normalize
      ? this.normalizePath(resolvedPath)
      : resolvedPath;
  }

  /**
   * 解析为对象路径
   * @param paths 相对路径
   * @param options 选项
   */
  protected resolvePaths(
    paths: string[] | string,
    options?: { normalize: boolean }
  ): string[] | string {
    return isArray(paths)
      ? paths.map((path: string) => this.resolvePath(path, options))
      : this.resolvePath(paths, options);
  }

  /**
   * 获取匹配的文件
   * @param paths 匹配表达式
   * @param options 匹配选项
   */
  protected glob(
    paths: string | string[],
    options?: globby.GlobbyOptions
  ): Promise<string[]> {
    const cwd = this.root;
    return globby(this.normalizePaths(paths), { cwd, ...options });
  }

  /**
   * 导入一个模块
   * @param moduleFile 模块路径
   */
  protected require(moduleFile: string) {
    try {
      return require(this.resolvePath(moduleFile));
    } catch {
      return null;
    }
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
      const types = this.require(moduleFile);
      if (!types) return;
      Object.keys(types).forEach(name => this.content.push(types[name]));
    });
  }
}
