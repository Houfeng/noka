import { LoaderConstructor } from "./LoaderConstructor";
import { LoaderOptions } from "./LoaderOptions";

export type LoaderConfigInfo<T extends LoaderOptions = LoaderOptions> = {
  loader: LoaderConstructor<T>;
  options?: T;
};
