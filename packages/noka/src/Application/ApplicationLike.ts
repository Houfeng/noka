import http from "http";
import https from "https";
import http2 from "http2";
import { Container } from "../Container";
import { ApplicationConfig } from "./ApplicationConfig";
import { DevToolLike } from "../DevTool/DevToolLike";
import { HttpRouter, HttpServer } from "./ApplicationTypes";
import { ApplicationSymbol } from "./ApplicationSymbol";
import { ApplicationLogger } from "./ApplicationLogger";

/**
 * 全局应用接口定义
 */
export interface ApplicationLike {
  /**
   * 应用配置模块向应用容器注册所用的 KEY
   * 应用日志模块向应用容器注册所用的 KEY
   */
  readonly symbols: typeof ApplicationSymbol;

  /**
   * 当前环境标识（取值 NOKA_ENV || NODE_ENV）
   */
  readonly env: string | undefined;

  /**
   * 是否是源码开发模式
   */
  readonly isSourceMode: boolean;

  /**
   * 面向开发时的工具
   */
  readonly devTool: DevToolLike;

  /**
   * 入口文件
   */
  readonly entry: string;

  /**
   * 应用根目录
   */
  readonly rootDir: string;

  /**
   * 应用在 ~（Home） 中的目录
   */
  readonly homeDir: string;

  /**
   * 解析应用内路径
   * @param path 路径
   * @returns
   */
  readonly parsePath: (path: string) => string;

  /**
   * 解析应用内路径
   * @param path 路径
   * @returns
   */
  readonly resolvePath: (path: string) => string;

  /**
   * 通过应用 entry 创建的应用内 require 方法
   * NodeRequire
   */
  readonly require: NodeRequire;

  /**
   * 应用端口
   */
  readonly port: number | undefined;

  /**
   * 应用配置
   */
  readonly config: ApplicationConfig;

  /**
   * 应用内部 server 实例（ HttpServer ）
   */
  readonly server: HttpServer;

  /**
   * 负责实际监听客户端请求的 http(s) server 实例
   * @returns
   */
  readonly listener:
    | ReturnType<typeof http.createServer>
    | ReturnType<typeof https.createServer>
    | ReturnType<typeof http2.createServer>
    | ReturnType<typeof http2.createSecureServer>;

  /**
   * 重新载入并更新 SSL 证书及相关配置信息
   */
  readonly reloadSecureContext: () => void;

  /**
   * 应用 Ioc 容器实例
   */
  readonly container: Container;

  /**
   * 应用的根路由实例
   */
  readonly router: HttpRouter;

  /**
   * 日志对象
   */
  readonly logger: ApplicationLogger | undefined;
}
