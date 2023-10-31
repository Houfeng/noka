/** @format */

import Koa from "koa";
import Router from "koa-router";
import {
  acquirePort,
  isNodePackageDir,
  isPath,
  isSystemRootDir,
  iife,
} from "../common/utils";
import { BuiltInLoaders } from "../BuiltInLoaders";
import { CONF_RESERVE_KEYS, ENV_NAME } from "./constants";
import { CONFIG_ENTITY_KEY } from "../BuiltInLoaders/ConfigLoader";
import { Container } from "../Container";
import { dirname, extname, resolve, normalize } from "path";
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
import { isString } from "ntils";
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
  constructor(protected options: ApplicationOptions = {}) {}

  /**
   * 当前环境标识
   */
  readonly env = process.env[ENV_NAME] || process.env.NODE_ENV;

  /**
   * 对应的 koa 实例
   */
  readonly server = new Koa();

  /**
   * IoC 容器实例
   */
  readonly container = new Container();

  /**
   * 应用路由
   */
  readonly router = new Router();

  /**
   * 入口文件
   */
  readonly entry = normalize(
    this.options.entry || process.env.pm_exec_path || process.argv[1],
  );

  /**
   * 应用可执行文件扩展名
   */
  readonly binExtensions = extname(this.entry);

  /**
   * 是否是开发模式
   */
  readonly isLaunchSourceCode = this.binExtensions === ".ts";

  /**
   * 应用根目录
   * 根目录为入口文件所在的 package 根目录
   */
  readonly rootDir = iife((): string => {
    let root = dirname(this.entry);
    while (!isSystemRootDir(root) && !isNodePackageDir(root)) {
      root = dirname(root);
    }
    if (isSystemRootDir(root) || root === ".") root = process.cwd();
    return root;
  });

  /**
   * 应用执行文件目录
   * bin 目录在应用根目录下，从源码启动时为 src/，非源码启动为 bin/
   */
  get binDir() {
    return this.isLaunchSourceCode
      ? this.resolvePath("./src/")
      : this.resolvePath("./bin/");
  }

  /**
   * 当前应用名称
   */
  get name(): string {
    if (this.options.name) return this.options.name;
    if (this.config.name) return this.config.name;
    const pkgFile = resolve(this.rootDir, "./package.json");
    return require(pkgFile).name;
  }

  /**
   * app 在 home 中的位置
   */
  get homeDir() {
    return normalize(`${homedir()}/${this.name}`);
  }

  /**
   * 解析相对于应用根路径 app.root 的 「相对路径」
   * @param path 路径信息
   * @returns
   */
  resolvePath(path: string) {
    path = normalize(
      path
        .replace("app:", this.rootDir)
        .replace("home:", this.homeDir)
        .replace("bin:", this.binDir)
        .replace(":bin", this.binExtensions),
    );
    return resolve(this.rootDir, path);
  }

  /**
   * 应用配置对象
   */
  get config(): ApplicationConfig {
    return this.container.get(CONFIG_ENTITY_KEY, true) || {};
  }

  /**
   * 应用日志对象
   */
  get logger() {
    const getLogger =
      this.container.get<(key: string) => LoggerInterface>(LOGGER_ENTITY_KEY);
    return getLogger && getLogger("app");
  }

  /**
   * 加载一个 loader
   * @param name loader 名称
   */
  private importLoader(name: string): LoaderConstructor {
    name = String(name);
    const loaderPath = isPath(name) ? resolve(this.rootDir, name) : name;
    const loader = require(loaderPath);
    return loader.default || loader;
  }

  /**
   * 创建一个 loader 实例
   * @param loaderConfigInfo loader 信息
   * @param configKey 配置名称
   */
  private createLoaderInstance(
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
  private createLoaderInstances(
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
   * 加载所有 loaders
   */
  private async loadAllLoaders() {
    const buildInLoaders = this.createLoaderInstances(BuiltInLoaders);
    const configLoaders = this.createLoaderInstances(this.config.loaders);
    const composedLoaders = [...buildInLoaders, ...configLoaders];
    for (const loader of composedLoaders) await loader.load();
  }

  /**
   * 当前应用端口私有变量
   */
  private resolvedPort: number;

  /**
   * 获取应用端口
   */
  private async resolvePort() {
    if (this.resolvedPort) return this.resolvedPort;
    const { port = this.config.port || (await acquirePort()) } = this.options;
    this.resolvedPort = port;
    return this.resolvedPort;
  }

  /**
   * 当前应用使用的端口
   */
  get port(): number {
    return this.resolvedPort;
  }

  /**
   * 启动当前应用实例
   */
  async launch(): Promise<ApplicationInterface> {
    this.loadAllLoaders();
    this.server.use(this.router.routes());
    this.server.use(this.router.allowedMethods());
    await this.resolvePort();
    this.server.listen(this.port);
    return this;
  }
}
