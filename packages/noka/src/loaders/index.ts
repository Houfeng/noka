import { ControllerLoader } from "./ControllerLoader";
import { HeaderLoader } from "./HeadersLoader";
import { LoggerLoader } from "./LoggerLoader";
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
export * from "./BodyLoader";
export * from "./ServiceLoader";
export * from "./ModelLoader";
export * from "./ViewLoader";
export * from "./SessionLoader";
export * from "./LoggerLoader";
export * from "./HeadersLoader";
export * from "./StaticLoader";
export * from "./SetupLoader";
export * from "./FilterLoader";

export const BuiltInLoaders = {
  logger: {
    loader: LoggerLoader,
    options: { targetDir: "home:/logs" },
  } satisfies LoaderConfigItem<typeof LoggerLoader>,
  service: {
    loader: ServiceLoader,
    options: { targetDir: "bin:/services" },
  } satisfies LoaderConfigItem<typeof ServiceLoader>,
  model: {
    loader: ModelLoader,
    options: { targetDir: "bin:/models" },
  } satisfies LoaderConfigItem<typeof ModelLoader>,
  header: {
    loader: HeaderLoader,
    options: { targetDir: "" },
  } satisfies LoaderConfigItem<typeof HeaderLoader>,
  body: {
    loader: BodyLoader,
    options: { targetDir: "" },
  } satisfies LoaderConfigItem<typeof BodyLoader>,
  session: {
    loader: SessionLoader,
    options: { targetDir: "" },
  } satisfies LoaderConfigItem<typeof SessionLoader>,
  view: {
    loader: ViewLoader,
    options: { targetDir: "app:/views" },
  } satisfies LoaderConfigItem<typeof ViewLoader>,
  setup: {
    loader: SetupLoader,
    options: { targetDir: "bin:/setups" },
  } satisfies LoaderConfigItem<typeof SetupLoader>,
  filter: {
    loader: FilterLoader,
    options: { targetDir: "bin:/filters" },
  } satisfies LoaderConfigItem<typeof FilterLoader>,
  controller: {
    loader: ControllerLoader,
    options: { targetDir: "bin:/controllers" },
  } satisfies LoaderConfigItem<typeof ControllerLoader>,
  static: {
    loader: StaticLoader,
    options: { targetDir: "app:/public" },
  } satisfies LoaderConfigItem<typeof StaticLoader>,
};
