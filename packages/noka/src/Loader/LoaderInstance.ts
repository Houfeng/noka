/**
 * 加载器接口定义
 *
 * @format
 */

import { LoaderOptions } from "./LoaderOptions";

export interface LoaderInstance {
  options: LoaderOptions;
  watchable?: boolean;
  load: () => Promise<void>;
  launch?: () => Promise<void>;
  unload?: () => Promise<void>;
}
