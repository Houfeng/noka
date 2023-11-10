/**
 * 全局应用类选项
 */
export type ApplicationOptions = {
  /**
   * 默认 entry 将自动取自 process.argv[1]
   * 在使用部分进程管理工具时 process.argv[1] 可能会变成管理器的容器进程
   * 此时，可通过 entry 选项显示的声明应用的入口模块文件路径
   * 通常可将 app 启动所在文件的 __filename 传给 entry
   */
  entry?: string;
};
