import { getByPath } from "noka-utility";
import { ContainerLike, Inject, InjectPropMetadata } from "../../Container";
import { AbstractLoader } from "../../Loader";
import { ApplicationConfigRegisterKey } from "../../Application/ApplicationConfig";

const { Parser } = require("confman/index");

/**
 * 配置注入处理函数
 * @param options 注入选项
 */
function configInjectHandler(
  container: ContainerLike,
  meta: InjectPropMetadata,
) {
  const configObject = container.get(ApplicationConfigRegisterKey);
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
    const { path = "app:/configs/config" } = this.options;
    const configPath = this.app.resolvePath(path);
    const configParser = new Parser({ env: this.app.env });
    const configObject = await configParser.load(configPath);
    this.app.container.register(ApplicationConfigRegisterKey, {
      type: "value",
      value: configObject,
    });
    this.watch([`${configPath}.*`, `${configPath}/**/*.*`]);
  }
  async unload(): Promise<void> {
    this.unWatch();
  }
}
