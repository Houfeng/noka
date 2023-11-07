import { LoaderConstructor } from "./LoaderConstructor";

export type LoaderConfigItem<T extends LoaderConstructor = LoaderConstructor> =
  {
    loader: T;
    options: ConstructorParameters<T>[1];
  };

export type LoaderConfigMap<T extends LoaderConstructor = LoaderConstructor> =
  Record<string, LoaderConfigItem<T>>;
