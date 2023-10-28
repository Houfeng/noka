/** @format */

import Koa from "koa";
import Router from "koa-router";
import { acquire } from "../common/oneport";
import { BuiltInLoaders } from "../BuiltInLoaders";
import { CONF_RESERVE_KEYS, ENV_NAME } from "./constants";
import { CONFIG_ENTITY_KEY } from "../BuiltInLoaders/ConfigLoader";
import { Container } from "../Container";
import { dirname, extname, normalize, resolve } from "path";
import { existsSync } from "fs";
import { homedir } from "os";
import { ApplicationInterface } from "./ApplicationInterface";
import { ApplicationOptions } from "./ApplicationOptions";
import { LoaderInstance } from "../Loader/LoaderInstance";
import { LoaderConstructor } from "../Loader/LoaderConstructor";
import { LoaderConfigInfo } from "../Loader/LoadConfigInfo";
import {
  LoggerInterface,
  LOGGER_ENTITY_KEY,
} from "../BuiltInLoaders/LoggerLoader";
import { isNull, isString } from "ntils";
import { ApplicationConfig } from "./ApplicationConfig";

/**
 * 全局应用程序类，每一个应用都会由一个 Application 实例开始
 */
export class Application implements ApplicationInterface {
  static create(options: ApplicationOptions = {}) {
    return new Application(options);
  }

  /**
   * 全局应用构造函数
   * @param options 应用程序类构建选项
   */
  constructor(protected options: ApplicationOptions = {}) { }

  /**
   * 当前环境标识
   */
  public readonly env = process.env[ENV_NAME] || process.env.NODE_ENV;

  /**
   * 对应的 koa 实例
   */
  public readonly server = new Koa();

  /**
   * IoC 容器实例
   */
  public readonly container = new Container();

  /**
   * 应用路由
   */
  public readonly router = new Router();

  protected __config: ApplicationConfig;

  /**
   * 应用配置对象
   */
  public get config(): ApplicationConfig {
    if (this.__config) return this.__config;
    this.__config = this.container.get(CONFIG_ENTITY_KEY, true);
    return this.__config || {};
  }

  /**
   * 应用日志对象
   */
  public get logger() {
    const getLogger =
      this.container.get<(key: string) => LoggerInterface>(LOGGER_ENTITY_KEY);
    return getLogger && getLogger("app");
  }

  /**
   * 是否是系统根目录
   * @param dir 目录
   */
  protected isSystemRootDir(dir: string) {
    return !dir || dir === "/" || dir.endsWith(":\\") || dir.endsWith(":\\\\");
  }

  /**
   * 目录中存在 package.json
   * @param dir 目录
   */
  protected isNodePackageDir(dir: string) {
    return existsSync(normalize(`${dir}/package.json`));
  }

  /**
   * 根目录缓存
   */
  protected __root: string;

  /**
   * 应用根目录
   */
  public get root() {
    if (this.options.root) return this.options.root;
    if (this.__root) return this.__root;
    let root = dirname(this.entry);
    while (!this.isSystemRootDir(root) && !this.isNodePackageDir(root)) {
      root = dirname(root);
    }
    if (this.isSystemRootDir(root) || root === ".") root = process.cwd();
    this.__root = root;
    return this.__root;
  }

  /**
   * 入口文件
   */
  get entry() {
    return process.env.pm_exec_path || process.argv[1];
  }

  /**
   * 字符串是不是一个路戏
   * @param str 字符串
   */
  protected isPath(str: string) {
    if (!str) return false;
    return str.startsWith("/") || str.startsWith(".") || /^[a-z]+:/i.test(str);
  }

  /**
   * 加载一个 loader
   * @param name loader 名称
   */
  protected importLoader(name: string): LoaderConstructor {
    name = String(name);
    const { root } = this.options;
    const loaderPath = this.isPath(name) ? resolve(root, name) : name;
    const loader = require(loaderPath);
    return loader.default || loader;
  }

  /**
   * 创建一个 loader 实例
   * @param loaderConfigInfo loader 信息
   * @param configKey 配置名称
   */
  protected createLoaderInstance(
    loaderConfigInfo: LoaderConfigInfo,
    configKey: string,
  ) {
    const { loader, options } = loaderConfigInfo;
    const loaderConfig = this.config[configKey];
    if (loaderConfig === false) return;
    return new loader(this, { ...options, ...loaderConfig });
  }

  /**
   * 创建一组 Loader 实例
   */
  protected createLoaderInstances(
    loaderConfigs: Record<string, string | LoaderConfigInfo<any>>,
  ): LoaderInstance[] {
    const loaderInstances: LoaderInstance[] = [];
    for (const loaderKey in loaderConfigs) {
      if (CONF_RESERVE_KEYS.includes(loaderKey)) {
        throw new Error(`Invalid Loader configuration name: ${loaderKey}`);
      }
      const loaderValue = loaderConfigs[loaderKey];
      if (!loaderValue) continue;
      const loadConfigInfo = (
        isString(loaderValue)
          ? { loader: this.importLoader(loaderValue) }
          : loaderValue
      ) as LoaderConfigInfo;
      const instance = this.createLoaderInstance(loadConfigInfo, loaderKey);
      loaderInstances.push(instance);
    }
    return loaderInstances;
  }

  /**
   * 当前应用端口私有变量
   */
  protected __port: number;

  /**
   * 获取应用端口
   */
  protected async resolvePort() {
    if (this.__port) return this.__port;
    const { port = this.config.port || (await acquire()) } = this.options;
    this.__port = port;
    return this.__port;
  }

  /**
   * 当前应用使用的端口
   */
  public get port() {
    return this.__port;
  }

  protected __name: string;

  /**
   * 当前应用名称
   */
  public get name() {
    if (this.__name) return this.__name;
    const pkgFile = resolve(this.root, "./package.json");
    const { name = this.config.name || require(pkgFile).name } = this.options;
    this.__name = name;
    return this.__name;
  }

  /**
   * app 在 home 中的位置
   */
  public get home() {
    return normalize(`${homedir()}/${this.name}`);
  }

  /**
   * 是否是开发模式
   */
  protected __isDevelopment: boolean;

  /**
   * 是否是开发模式
   */
  public get isDevelopment() {
    if (isNull(this.__isDevelopment)) {
      const ext = extname(this.entry);
      this.__isDevelopment = ext === ".ts";
    }
    return this.__isDevelopment;
  }

  /**
   * 启动当前应用实例
   */
  public async launch(): Promise<ApplicationInterface> {
    const buildInLoaders = this.createLoaderInstances(BuiltInLoaders);
    for (const loader of buildInLoaders) await loader.load();
    const configLoaders = this.createLoaderInstances(this.config.loaders);
    for (const loader of configLoaders) await loader.load();
    this.server.use(this.router.routes());
    this.server.use(this.router.allowedMethods());
    await this.resolvePort();
    this.server.listen(this.port);
    return this;
  }
}
