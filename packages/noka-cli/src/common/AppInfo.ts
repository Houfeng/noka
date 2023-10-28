/** @format */

import { dirname, normalize, resolve } from "path";
import { DIST_PATH, SRC_PATH } from "./constants";
import { existsSync } from "fs";

/**
 * 应用信息构造选项
 */
export interface IAppInfoOptions {
  // 当前环境名称
  env?: string;
  // 启动点（入口文件或应用目录）
  $1?: string;
}

/**
 * 当前应用信息
 */
export class AppInfo {
  /**
   * 构建一个应用信息实例
   * @param startPoint 启动入口
   */
  constructor(private options: IAppInfoOptions = {}) {}

  /**
   * 应用启动点
   */
  public get startPoint() {
    const cwd = process.cwd();
    return this.options.$1 ? resolve(cwd, this.options.$1) : cwd;
  }

  /**
   * 录前环境名称
   */
  public get env() {
    return this.options.env || process.env.NOKA_ENV || process.env.NODE_ENV;
  }

  /**
   * 是否是系统根目录
   * @param dir 目录
   */
  private isSystemRootDir(dir: string) {
    return !dir || dir === "/" || dir.endsWith(":\\") || dir.endsWith(":\\\\");
  }

  /**
   * 目录中存在 package.json
   * @param dir 目录
   */
  private existsPackage(dir: string) {
    return existsSync(normalize(`${dir}/package.json`));
  }

  /**
   * 根目录缓存
   */
  private __root: string;

  /**
   * 应用根目录
   */
  public get root() {
    if (this.__root) return this.__root;
    let root = this.startPoint;
    while (!this.isSystemRootDir(root) && !this.existsPackage(root)) {
      root = dirname(root);
    }
    if (this.isSystemRootDir(root) || root === ".") root = process.cwd();
    this.__root = root;
    return this.__root;
  }

  /**
   * 配置信息
   */
  public get config() {
    const { Parser } = require("confman/index");
    const configParser = new Parser({ env: this.env });
    const configFile = resolve(this.root, "./configs/config");
    const configObject = configParser.load(configFile);
    return configObject;
  }

  protected load(filename: string, defaultValue: any = null) {
    try {
      return require(filename);
    } catch {
      return defaultValue;
    }
  }

  /**
   * 当前应用的 package 信息
   */
  public get package() {
    const pkgFile = resolve(this.root, "./package.json");
    return this.load(pkgFile, {});
  }

  /**
   * 当前应用 tsconfig
   */
  public get tsConfig() {
    return this.load(this.tsConfigFile);
  }

  /**
   * tsconfig 文件路径
   */
  public get tsConfigFile() {
    return resolve(this.root, "./tsconfig.json");
  }

  /**
   * 当前应用名称
   */
  public get name() {
    return { ...this.package, ...this.config }.name;
  }

  /**
   * 当前应用的 js 入口文件
   */
  public get jsEntry() {
    const tsconfig = { outDir: DIST_PATH, ...this.tsConfig };
    return resolve(this.root, normalize(`./${tsconfig.outDir}/app.js`));
  }

  /**
   * 当前应用的 ts 入口文件
   */
  public get tsEntry() {
    const tsconfig = { rootDir: SRC_PATH, ...this.tsConfig };
    return resolve(this.root, normalize(`./${tsconfig.rootDir}/app.ts`));
  }

  /**
   * 源文件目录
   */
  public get srcPath() {
    const tsconfig = { rootDir: SRC_PATH, ...this.tsConfig };
    return tsconfig.rootDir;
  }

  /**
   * 构建输出目录
   */
  public get distPath() {
    const tsconfig = { outDir: DIST_PATH, ...this.tsConfig };
    return tsconfig.outDir;
  }
}
