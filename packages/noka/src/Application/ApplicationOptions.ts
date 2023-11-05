/**
 * 全局应用类选项
 */
export type ApplicationOptions = {
  /**
   * 应用端口
   * 优先级: options.name > config.name
   * 启动时未指定也会在 config 中配置时, 将自动选取可用端口
   */
  port?: number;

  /**
   * 绑定的主机名
   * 优先级: options.name > config.name
   */
  hostname?: string;

  /**
   * 应用名称
   * 优先级: options.name > config.name > package.name
   */
  name?: string;

  /**
   * 应用程序入口 (主要给 CLI 使用)
   */
  entry?: string;
};
