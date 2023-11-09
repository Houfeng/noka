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
    options: { targetDir: "app:/configs" },
  } satisfies LoaderConfigItem<typeof ConfigLoader>,
  logger: {
    loader: LoggerLoader,
    options: { targetDir: "home:/logs" },
  } satisfies LoaderConfigItem<typeof LoggerLoader>,
  entity: {
    loader: EntityLoader,
    options: { targetDir: "bin:/entities" },
  } satisfies LoaderConfigItem<typeof EntityLoader>,
  service: {
    loader: ServiceLoader,
    options: { targetDir: "bin:/services" },
  } satisfies LoaderConfigItem<typeof ServiceLoader>,
  model: {
    loader: ModelLoader,
    options: { targetDir: "bin:/models" },
  } satisfies LoaderConfigItem<typeof ModelLoader>,
  headers: {
    loader: HeadersLoader,
    options: { targetDir: "" },
  } satisfies LoaderConfigItem<typeof HeadersLoader>,
  body: {
    loader: BodyLoader,
    options: { targetDir: "" },
  } satisfies LoaderConfigItem<typeof BodyLoader>,
  session: {
    loader: SessionLoader,
    options: { targetDir: "" },
  } satisfies LoaderConfigItem<typeof SessionLoader>,
  static: {
    loader: StaticLoader,
    options: { targetDir: "app:/assets" },
  } satisfies LoaderConfigItem<typeof StaticLoader>,
  setup: {
    loader: SetupLoader,
    options: { targetDir: "bin:/setups" },
  } satisfies LoaderConfigItem<typeof SetupLoader>,
  view: {
    loader: ViewLoader,
    options: { targetDir: "app:/views" },
  } satisfies LoaderConfigItem<typeof ViewLoader>,
  filter: {
    loader: FilterLoader,
    options: { targetDir: "bin:/filters" },
  } satisfies LoaderConfigItem<typeof FilterLoader>,
  controller: {
    loader: ControllerLoader,
    options: { targetDir: "bin:/controllers" },
  } satisfies LoaderConfigItem<typeof ControllerLoader>,
};
