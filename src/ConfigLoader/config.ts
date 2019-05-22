import { CONFIG_ENTITY_KEY } from "./constants";
import { IInjectGetterOptions } from "../IoCLoader/InjectGetter";
import { inject } from "../IoCLoader";

const { getByPath } = require("ntils");

export function configInjectGetter(options: IInjectGetterOptions) {
  const { container, info } = options;
  const configObject = container.get(CONFIG_ENTITY_KEY);
  return getByPath(configObject, info.name);
}

/**
 * 向 service 或 controller 注入配置
 * @param path 配置项的 JSON Path
 */
export function config(path: string) {
  return inject(path, { getter: configInjectGetter });
}
