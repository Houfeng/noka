import { getByPath } from "../../common/utils";
import { ContainerType, Inject, InjectPropMetadata } from "../../Container";
import { AbstractLoader } from "../../Loader";
import { resolve } from "path";

const { Parser } = require("confman/index");

export const CONFIG_ENTITY_KEY = Symbol('Config');

/**
 * 配置注入处理函数
 * @param options 注入选项
 */
function configInjectHandler(container: ContainerType, meta: InjectPropMetadata) {
  const configObject = container.get(CONFIG_ENTITY_KEY);
  return getByPath(configObject, String(meta.name));
}

/**
 * 向 service 或 controller 注入配置
 * @param path 配置项的 JSON Path
 */
export function Config(path: string) {
  return Inject(path, { handle: configInjectHandler });
}

/**
 * 配置加载器
 */
export class ConfigLoader extends AbstractLoader {
  public async load() {
    const { root } = this.app;
    const { path } = this.options;
    const configPath = resolve(root, path);
    const configParser = new Parser({ env: this.env });
    const configObject = await configParser.load(configPath);
    this.container.register(CONFIG_ENTITY_KEY, { type: 'value', value: configObject });
    this.watchBy([`${configPath}.*`, `${configPath}/**/*.*`]);
  }
}