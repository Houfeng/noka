/** @format */

import { ConfigLoader } from "./ConfigLoader";
import { ControllerLoader } from "./ControllerLoader";
import { HeadersLoader } from "./HeadersLoader";
import { LoggerLoader } from "./LoggerLoader";
import { ModelLoader } from "./ModelLoader";
import { ServiceLoader } from "./ServiceLoader";
import { SessionLoader } from "./SessionLoader";
import { SetupLoader } from "./SetupLoader";
import { StaticLoader } from "./StaticLoader";
import { ViewLoader } from "./ViewLoader";
import { BodyLoader } from "./BodyLoader";
import { LoaderConfigInfo } from "../Loader";

export * from "./IoCLoader";
export * from "./ControllerLoader";
export * from "./ServiceLoader";
export * from "./ConfigLoader";
export * from "./ViewLoader";
export * from "./SessionLoader";
export * from "./ModelLoader";
export * from "./LoggerLoader";
export * from "./HeadersLoader";
export * from "./StaticLoader";
export * from "./SetupLoader";

export const BuiltInLoaders: Record<string, LoaderConfigInfo<any>> = {
  config: {
    loader: ConfigLoader,
    options: { path: "./configs/config" },
  },
  logger: {
    loader: LoggerLoader,
    options: { path: ":home/logs" },
  },
  headers: {
    loader: HeadersLoader,
  },
  setup: {
    loader: SetupLoader,
    options: { path: "./:main/setups/**/*:ext" },
  },
  body: {
    loader: BodyLoader,
  },
  model: {
    loader: ModelLoader,
    options: { path: "./:main/models/**/*:ext" },
  },
  service: {
    loader: ServiceLoader,
    options: { path: "./:main/services/**/*:ext" },
  },
  session: {
    loader: SessionLoader,
  },
  view: {
    loader: ViewLoader,
    options: { path: "./views", extname: ".html" },
  },
  static: {
    loader: StaticLoader,
    options: { path: "./assets" },
  },
  controller: {
    loader: ControllerLoader,
    options: { path: "./:main/controllers/**/*:ext" },
  },
};