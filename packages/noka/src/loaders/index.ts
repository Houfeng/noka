/** @format */

import { ConfigLoader } from "./ConfigLoader";
import { ControllerLoader } from "./ControllerLoader";
import { HeadersLoader } from "./HeadersLoader";
import { LoggerLoader } from "./LoggerLoader";
import { EntityLoader } from "./EntityLoader";
import { ServiceLoader } from "./ServiceLoader";
import { SessionLoader } from "./SessionLoader";
import { SetupLoader } from "./SetupLoader";
import { StaticLoader } from "./StaticLoader";
import { ViewLoader } from "./ViewLoader";
import { BodyLoader } from "./BodyLoader";
import { LoaderConfigInfo } from "../Loader";

export * from "./ProviderLoader";
export * from "./ControllerLoader";
export * from "./ServiceLoader";
export * from "./ConfigLoader";
export * from "./ViewLoader";
export * from "./SessionLoader";
export * from "./EntityLoader";
export * from "./LoggerLoader";
export * from "./HeadersLoader";
export * from "./StaticLoader";
export * from "./SetupLoader";

export const BuiltInLoaders: Record<string, LoaderConfigInfo<any>> = {
  config: {
    loader: ConfigLoader,
    options: { path: "app:/configs/config" },
  },
  logger: {
    loader: LoggerLoader,
    options: { path: "home:/logs" },
  },
  headers: {
    loader: HeadersLoader,
    options: {},
  },
  setup: {
    loader: SetupLoader,
    options: { path: "bin:/setups/**/*:bin" },
  },
  body: {
    loader: BodyLoader,
    options: {},
  },
  entity: {
    loader: EntityLoader,
    options: { path: "bin:/entities/**/*:bin" },
  },
  service: {
    loader: ServiceLoader,
    options: { path: "bin:/services/**/*:bin" },
  },
  session: {
    loader: SessionLoader,
    options: {},
  },
  view: {
    loader: ViewLoader,
    options: { path: "app:/views", extname: ".html" },
  },
  static: {
    loader: StaticLoader,
    options: { path: "app:/assets" },
  },
  controller: {
    loader: ControllerLoader,
    options: { path: "bin:/controllers/**/*:bin" },
  },
};
