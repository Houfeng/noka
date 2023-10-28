/**
 * 加载器接口定义
 */
export interface LoaderInstance {
  load(): Promise<void>;
}
