import http from "http";
import https from "https";
import { BIN_DIR_NAME, SRC_DIR_NAME, iife, merge, mkdirp } from "noka-utility";
import { acquirePort, isPath, resolvePackageRoot } from "noka-utility";
import { BuiltInLoaders } from "../loaders";
import { Container } from "../Container";
import { extname, resolve, normalize } from "path";
import { homedir } from "os";
import { ApplicationLike } from "./ApplicationLike";
import { ApplicationOptions } from "./ApplicationOptions";
import { LoaderInstance } from "../Loader/LoaderInstance";
import { LoaderConstructor } from "../Loader/LoaderConstructor";
import { LoaderConfigItem, LoaderConfigMap } from "../Loader/LoaderConfigTypes";
import { ApplicationConfig } from "./ApplicationConfig";
import { existsSync, readFileSync } from "fs";
import { LoaderOptions } from "../Loader/LoaderOptions";
import { DevTool } from "../DevTool";
import { HttpRouter, HttpServer } from "./ApplicationTypes";
import { ApplicationSymbol } from "./ApplicationSymbol";
import { ApplicationLogger } from "./ApplicationLogger";
import { Module } from "module";

/**
 * 全局应用程序类，每一个应用都会由一个 Application 实例开始
 */
export class Application implements ApplicationLike {
  static create(options: ApplicationOptions = {}) {
    return new Application(options);
  }

  readonly symbols = ApplicationSymbol;

  /**
   * 全局应用构造函数
   * @param options 应用程序类构建选项
   */
  constructor(protected options: ApplicationOptions = {}) {
    process.once("beforeExit", () => this.stop());
  }

  /**
   * 当前环境标识
   */
  readonly env = process.env.NOKA_ENV || process.env.NODE_ENV;

  /**
   * 对应的 koa 实例
   */
  readonly server = new HttpServer();

  /**
   * 应用路由
   */
  readonly router = new HttpRouter();

  /**
   * IoC 容器实例
   */
  readonly container = new Container();

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
   * 是否是源码模式
   */
  readonly isSourceMode = this.binExtensions === ".ts";

  /**
   * 应用根目录
   * 根目录为入口文件所在的 package 根目录
   */
  readonly rootDir = resolvePackageRoot(this.entry);

  /**
   * 应用执行文件目录
   * bin 目录在应用根目录下，从源码启动时为 src/，非源码启动为 bin/
   */
  get binDir() {
    return this.isSourceMode
      ? this.resolvePath(`./${SRC_DIR_NAME}/`, true)
      : this.resolvePath(`./${BIN_DIR_NAME}/`, true);
  }

  /**
   * 应用的 package.json 文件路径
   */
  private appPkgFile = resolve(this.rootDir, "./package.json");

  /**
   * 当前应用名称
   */
  get name(): string {
    return require(this.appPkgFile).name;
  }

  /**
   * app 在 home 中的位置
   */
  get homeDir() {
    return normalize(`${homedir()}/${this.name}`);
  }

  /**
   * 检查应用 homeDir 是否存在，如果不存在自动创建
   */
  private async ensureHomeDir() {
    if (existsSync(this.homeDir)) return;
    await mkdirp(this.homeDir);
  }

  /**
   * 解析路径中的变量
   * @param path 路径
   * @returns
   */
  parsePath(path: string) {
    return normalize(
      path
        .replace("~/", normalize(`${homedir()}/`))
        .replace("app:", this.rootDir)
        .replace("home:", this.homeDir)
        .replace("bin:", this.binDir)
        .replace(":bin", this.binExtensions),
    );
  }

  /**
   * 解析相对于应用根路径 app.root 的 「相对路径」
   * @param path 路径信息
   * @returns
   */
  resolvePath(path: string, disableVariables = false) {
    if (!disableVariables) path = this.parsePath(path);
    return resolve(this.rootDir, normalize(path));
  }

  /**
   * 通过应用 entry 创建的应用内 require 方法
   * NodeRequire
   */
  readonly require = Module.createRequire(this.appPkgFile);

  /**
   * 应用配置对象
   */
  get config(): ApplicationConfig {
    return this.container.get(this.symbols.Config, true) || {};
  }

  /**
   * 加载应用程序配置
   */
  private async loadConfig() {
    const { Parser } = require("confman/index");
    const root = this.resolvePath("app:/configs");
    const file = normalize(`${root}/config`);
    const parser = new Parser({ env: this.env });
    const config = await parser.load(file);
    this.container.register(ApplicationSymbol.Config, {
      type: "value",
      value: config,
    });
    this.devTool.watchDir(root);
  }

  /**
   * 应用日志对象
   */
  get logger() {
    const getLogger = this.container.get<(key: string) => ApplicationLogger>(
      this.symbols.Logger,
    );
    return getLogger && getLogger("app");
  }

  /**
   * 所有 loader 实例
   */
  private loaderInstances: LoaderInstance[] = [];

  /**
   * 加载一个 loader
   * @param name loader 名称
   */
  private importLoader(name: string): LoaderConstructor {
    name = String(name);
    const loaderPath = isPath(name) ? resolve(this.rootDir, name) : name;
    const loader = this.require(loaderPath);
    return loader.default || loader;
  }

  /**
   * 导入用户配置的 loaders
   */
  private importUserLoaders(): LoaderConfigMap {
    const { loader_imports = {} } = this.config;
    return Object.entries(loader_imports || {}).reduce<LoaderConfigMap>(
      (map, [key, value]) => {
        const loader = this.importLoader(value);
        const options: LoaderOptions = {};
        return { ...map, [key]: { loader, options } };
      },
      {},
    );
  }

  /**
   * 通过 loaderConfigItem 创建一个 loader 实例
   * @param configKey 配置名称
   * @param configItem 配置信息
   */
  private createLoaderInstance(
    configKey: string,
    configItem: LoaderConfigItem,
  ) {
    const { loader, options } = configItem;
    const { loader_options } = this.config;
    const userOptions = loader_options?.[configKey];
    if (userOptions === false) return;
    return new loader(this, { ...options, ...userOptions });
  }

  /**
   * 创建所有 Loaders 实例
   */
  private createAllLoaderInstances() {
    const userLoaders = this.importUserLoaders();
    const composedLoaders = merge(BuiltInLoaders, userLoaders);
    this.loaderInstances = Object.entries(composedLoaders)
      .map(([key, item]) => this.createLoaderInstance(key, item))
      .filter((it) => !!it) as LoaderInstance[];
  }

  /**
   * 加载所有 loaders
   */
  private async loadAllLoaderInstances() {
    try {
      for (const loader of this.loaderInstances) await loader.load();
    } catch (err) {
      this.logger?.error(err);
    }
  }

  /**
   * 卸载所有 loaders
   */
  private async launchAllLoaderInstances() {
    try {
      for (const loader of this.loaderInstances) await loader.launch();
    } catch (err) {
      this.logger?.error(err);
    }
  }

  /**
   * 卸载所有 loaders
   */
  private async unloadAllLoaderInstances() {
    try {
      for (const loader of this.loaderInstances) await loader.unload();
    } catch (err) {
      this.logger?.error(err);
    }
  }

  /**
   * 当前应用端口私有变量
   */
  private resolvedPort?: number;

  /**
   * 获取应用端口
   */
  private async resolvePort() {
    if (this.resolvedPort) return this.resolvedPort;
    const port = this.config.port || (await acquirePort());
    this.resolvedPort = port;
    return this.resolvedPort;
  }

  /**
   * 当前应用使用的端口
   */
  get port(): number | undefined {
    return this.resolvedPort;
  }

  /**
   * 绑定的主机名
   */
  get hostname() {
    return this.config.hostname;
  }

  /**
   * 负责实际监听客户端请求的 http(s) server 实例
   */
  readonly listener = iife(() => {
    const { secure } = this.config;
    const handler = this.server.callback();
    if (!secure) return http.createServer(handler);
    const { key, cert, ...others } = secure;
    const options = {
      key: readFileSync(this.resolvePath(key)),
      cert: readFileSync(this.resolvePath(cert)),
      ...others,
    };
    return https.createServer(options, handler);
  });

  /**
   * 启动当前应用实例
   */
  async launch(): Promise<ApplicationLike> {
    await this.ensureHomeDir();
    await this.loadConfig();
    await this.createAllLoaderInstances();
    await this.loadAllLoaderInstances();
    this.server.use(this.router.routes());
    this.server.use(this.router.allowedMethods());
    await this.launchAllLoaderInstances();
    await this.resolvePort();
    this.listener.listen(this.port, this.hostname);
    this.devTool.startWatch();
    return this;
  }

  /**
   * 停止当前应用实例
   */
  async stop() {
    this.devTool.stopWatch();
    this.unloadAllLoaderInstances();
    this.listener.close();
  }

  /** 开发时工具 */
  readonly devTool = new DevTool({
    enabled: this.isSourceMode,
    entry: this.entry,
    watchDir: [this.binDir],
    resolvePath: (path: string) => this.resolvePath(path),
    stopApp: () => this.stop(),
    logger: () => this.logger,
  });
}
