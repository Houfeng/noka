import { IApplication } from "../Application";
import { ILoader } from "./ILoader";
import { ILoaderOptions } from "./ILoaderOptions";

/**
 * 加载器构造接口
 */
export type ILoaderConstructor = new (
  app: IApplication,
  options: ILoaderOptions
) => ILoader;
