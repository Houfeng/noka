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
import { FilterLoader } from "./FilterLoader";
import { ModelLoader } from "./ModelLoader";
import { LoaderConfigItem } from "../Loader/LoaderConfigTypes";
export * from "./ProviderLoader";
export * from "./ControllerLoader";
export * from "./ServiceLoader";
export * from "./ModelLoader";
export * from "./ConfigLoader";
export * from "./ViewLoader";
export * from "./SessionLoader";
export * from "./EntityLoader";
export * from "./LoggerLoader";
export * from "./HeadersLoader";
export * from "./StaticLoader";
export * from "./SetupLoader";
export * from "./FilterLoader";

export const BuiltInLoaders = {
  config: {
    loader: ConfigLoader,
    options: { path: "app:/configs/config" },
  } satisfies LoaderConfigItem<typeof ConfigLoader>,
  logger: {
    loader: LoggerLoader,
    options: { path: "home:/logs" },
  } satisfies LoaderConfigItem<typeof LoggerLoader>,
  entity: {
    loader: EntityLoader,
    options: { path: "bin:/entities/**/*:bin" },
  } satisfies LoaderConfigItem<typeof EntityLoader>,
  service: {
    loader: ServiceLoader,
    options: { path: "bin:/services/**/*:bin" },
  } satisfies LoaderConfigItem<typeof ServiceLoader>,
  model: {
    loader: ModelLoader,
    options: { path: "bin:/models/**/*:bin" },
  } satisfies LoaderConfigItem<typeof ModelLoader>,
  headers: {
    loader: HeadersLoader,
    options: { path: "" },
  } satisfies LoaderConfigItem<typeof HeadersLoader>,
  body: {
    loader: BodyLoader,
    options: { path: "" },
  } satisfies LoaderConfigItem<typeof BodyLoader>,
  session: {
    loader: SessionLoader,
    options: { path: "" },
  } satisfies LoaderConfigItem<typeof SessionLoader>,
  static: {
    loader: StaticLoader,
    options: { path: "app:/assets" },
  } satisfies LoaderConfigItem<typeof StaticLoader>,
  setup: {
    loader: SetupLoader,
    options: { path: "bin:/setups/**/*:bin" },
  } satisfies LoaderConfigItem<typeof SetupLoader>,
  view: {
    loader: ViewLoader,
    options: { path: "app:/views", extname: ".html" },
  } satisfies LoaderConfigItem<typeof ViewLoader>,
  filter: {
    loader: FilterLoader,
    options: { path: "bin:/filters/**/*:bin" },
  } satisfies LoaderConfigItem<typeof FilterLoader>,
  controller: {
    loader: ControllerLoader,
    options: { path: "bin:/controllers/**/*:bin" },
  } satisfies LoaderConfigItem<typeof ControllerLoader>,
};
