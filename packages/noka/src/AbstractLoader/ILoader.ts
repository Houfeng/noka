/**
 * 加载器接口定义
 */
export interface ILoader {
  load(): Promise<void>;
}
