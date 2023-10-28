import Koa from "koa";
import Router from "koa-router";
import { acquire } from "../common/oneport";
import { BuiltInLoaders } from "./BuiltInLoaders";
import { CONF_RESERVE_KEYS, ENV_NAME } from "./constants";
import { CONFIG_ENTITY_KEY } from "../ConfigLoader";
import { Container } from "../IOCContainer";
import { dirname, extname, normalize, resolve } from "path";
import { EventEmitter } from "events";
import { existsSync } from "fs";
import { homedir } from "os";
import { ApplicationInterface } from "./ApplicationInterface";
import { ApplicationOptions } from "./ApplicationOptions";
import { LoaderInstance } from "../AbstractLoader/LoaderInstance";
import { LoaderConstructor } from "../AbstractLoader/LoaderConstructor";
import { LoaderConfigInfo } from "../AbstractLoader/LoadConfigInfo";
import { ILogger } from "../LoggerLoader/ILogger";
import { LOGGER_ENTITY_KEY } from "../LoggerLoader/constants";
import { isObject, isNull } from "ntils";

/**
 * 全局应用程序类，每一个应用都会由一个 Application 实例开始
 */
export class Application extends EventEmitter implements ApplicationInterface {
  static create(options: ApplicationOptions = {}) {
    return new Application(options);
  }

  /**
   * 全局应用构造函数
   * @param options 应用程序类构建选项
   */
  constructor(protected options: ApplicationOptions = {}) {
    super();
  }

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

  /**
   * 应用配置对象
   */
  public get config() {
    return this.container.get(CONFIG_ENTITY_KEY) || {};
  }

  /**
   * 应用日志对象
   */
  public get logger() {
    const getLogger = this.container.get(LOGGER_ENTITY_KEY);
    return (getLogger && getLogger("app")) as ILogger;
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
  protected existsPackage(dir: string) {
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
    while (!this.isSystemRootDir(root) && !this.existsPackage(root)) {
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
   * 内建的 loaders
   */
  static loaders = BuiltInLoaders;

  /**
   * 获取内建的 loaders
   */
  protected getBuiltInLoaders() {
    return Application.loaders;
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
   * @param loaderInfo loader 信息
   * @param configKey 配置名称
   */
  protected createLoaderInstance(
    loaderInfo: LoaderConfigInfo,
    configKey: string,
  ) {
    const { loader, options } = loaderInfo;
    const loaderConfig = this.config[configKey];
    if (loaderConfig === false) return;
    return new loader(this, { ...options, ...loaderConfig });
  }

  /**
   * 获取所有 loaders
   */
  protected createAllLoaderInstances(): LoaderInstance[] {
    const loaderInfoMap = {
      ...this.getBuiltInLoaders(),
      ...this.config.loaders,
    };
    const loaderInstances: LoaderInstance[] = [];
    for (const name in loaderInfoMap) {
      if (CONF_RESERVE_KEYS.includes(name)) {
        throw new Error(`Invalid Loader configuration name: ${name}`);
      }
      const value = loaderInfoMap[name];
      if (!value) continue;
      const loaderInfo = <LoaderConfigInfo>(
        (isObject(value) ? value : { loader: this.importLoader(value) })
      );
      const instance = this.createLoaderInstance(loaderInfo, name);
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
  protected async getPort() {
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

  /**
   * 当前应用名称
   */
  public get name() {
    const pkgFile = resolve(this.root, "./package.json");
    const { name = this.config.name || require(pkgFile).name } = this.options;
    return name;
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
    const loaders = await this.createAllLoaderInstances();
    for (const loader of loaders) await loader.load();
    this.server.use(this.router.routes());
    this.server.use(this.router.allowedMethods());
    const port = await this.getPort();
    this.server.listen(port);
    return this;
  }
}
