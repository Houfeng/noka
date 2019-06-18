import * as Koa from "koa";
import * as Router from "koa-router";
import { Container } from "../IoCLoader";
import { ILogger } from "../LoggerLoader/ILogger";
import { WatchOptions } from "chokidar";

/**
 * 全局应用接口定义
 */
export interface IApplication {
  /**
   * 当前环境标识（取值 NOKA_ENV || NODE_ENV）
   */
  readonly env: string;

  /**
   * 应用根目录
   */
  readonly root: string;

  /**
   * 入口文件
   */
  readonly entry: string;

  /**
   * 应用配置
   */
  readonly config: any;

  /**
   * 应用内部 server 实例（Koa）
   */
  readonly server: Koa;

  /**
   * 应用 Ioc 容器实例
   */
  readonly container: Container;

  /**
   * 应用的根路由实例
   */
  readonly router: Router;

  /**
   * 日志对象
   */
  readonly logger: ILogger;

  /**
   * 应用端口
   */
  readonly port: number;

  /**
   * 应用名称
   */
  readonly name: string;

  /**
   * 在通过 noka-cli 启动时，可通过此方法监听指定的文件，并自动重启进程
   * 在非 noka-cli 启动时，此方法将不会起任何作用
   * 请不用将 .js 和 .ts 文件传给此方法，因为代码文件默认就会自动重启
   * @param paths 文件（file, dir, glob, or array）
   */
  watchBy(paths: string | string[], options?: WatchOptions): void;
}
