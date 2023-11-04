import http from "http";
import https from "https";
import http2 from "http2";
import * as Koa from "koa";
import * as Router from "koa-router";
import { Container } from "../Container";
import { LoggerInterface } from "../loaders/LoggerLoader";
import { ApplicationConfig } from "./ApplicationConfig";

export type ListenServerLike = {
  listen: (port: number, hostname: string, callback?: () => void) => void;
};

/**
 * 全局应用接口定义
 */
export interface ApplicationLike {
  /**
   * 当前环境标识（取值 NOKA_ENV || NODE_ENV）
   */
  readonly env: string | undefined;

  /**
   * 是否是开发模式
   */
  readonly isLaunchSourceCode: boolean;

  /**
   * 入口文件
   */
  readonly entry: string;

  /**
   * 应用根目录
   */
  readonly rootDir: string;

  /**
   * 应用名称
   */
  readonly name: string;

  /**
   * 应用在 ~（Home） 中的目录
   */
  readonly homeDir: string;

  /**
   * 解析应用内路径
   * @param path 路径
   * @returns
   */
  readonly resolvePath: (path: string) => string;

  /**
   * 应用端口
   */
  readonly port: number | undefined;

  /**
   * 应用配置
   */
  readonly config: ApplicationConfig;

  /**
   * 应用内部 server 实例（Koa）
   */
  readonly server: Koa;

  /**
   * 负责实际监听客户端请求的 http(s) server 实例
   * @returns
   */
  readonly listener:
    | ReturnType<typeof http.createServer>
    | ReturnType<typeof https.createServer>
    | ReturnType<typeof http2.createSecureServer>;

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
  readonly logger: LoggerInterface | undefined;
}
