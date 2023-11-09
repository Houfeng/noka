/**
 * 加载器接口定义
 *
 * @format
 */

export interface LoaderInstance {
  load: () => Promise<void>;
  launch?: () => Promise<void>;
  unload?: () => Promise<void>;
}
