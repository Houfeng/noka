import { getByPath } from "../../common/utils";
import { ContainerType, Inject, InjectPropMetadata } from "../../Container";
import { AbstractLoader } from "../../Loader";

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
  async load() {
    const { path } = this.options;
    const configPath = this.app.resolvePath(path);
    const configParser = new Parser({ env: this.app.env });
    const configObject = await configParser.load(configPath);
    this.app.container.register(CONFIG_ENTITY_KEY, {
      type: 'value',
      value: configObject,
    });
    this.watch([`${configPath}.*`, `${configPath}/**/*.*`]);
  }
  async unload(): Promise<void> {
    this.unWatch()
  }
}