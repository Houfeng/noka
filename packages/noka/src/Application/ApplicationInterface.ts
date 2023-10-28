/** @format */

import * as Koa from "koa";
import * as Router from "koa-router";
import { Container } from "../Container";
import { LoggerInterface } from "../BuiltInLoaders/LoggerLoader";
import { ApplicationConfig } from "./ApplicationConfig";

/**
 * 全局应用接口定义
 */
export interface ApplicationInterface {
  /**
   * 当前环境标识（取值 NOKA_ENV || NODE_ENV）
   */
  readonly env: string;

  /**
   * 是否是开发模式
   */
  readonly isDevelopment: boolean;

  /**
   * 入口文件
   */
  readonly entry: string;

  /**
   * 应用根目录
   */
  readonly root: string;

  /**
   * 应用端口
   */
  readonly port: number;

  /**
   * 应用名称
   */
  readonly name: string;

  /**
   * 应用在 ~（Home） 中的目录
   */
  readonly home: string;

  /**
   * 应用配置
   */
  readonly config: ApplicationConfig;

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
  readonly logger: LoggerInterface;
}
