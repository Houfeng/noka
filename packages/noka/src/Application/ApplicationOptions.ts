/**
 * 全局应用类选项接口
 *
 * @format
 */

export type ApplicationOptions = {
  /**
   * 应用端口（默认自动选取可用端口）
   */
  port?: number;

  /**
   * 绑定的主机名
   */
  hostname?: string;

  /**
   * 应用名称（优先级为 options.name>config.name>package.name）
   */
  name?: string;

  /**
   * 应用程序入口（绝对路径）
   */
  entry?: string;
};
