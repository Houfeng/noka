import { ApplicationLike } from "../Application";
import { LoaderInstance } from "./LoaderInstance";
import { LoaderOptions } from "./LoaderOptions";

/**
 * 加载器构造接口
 */
export type LoaderConstructor<T extends LoaderOptions = LoaderOptions> = new (
  app: ApplicationLike,
  options: T,
) => LoaderInstance;
