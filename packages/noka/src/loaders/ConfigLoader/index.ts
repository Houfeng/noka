import { getByPath } from "noka-utility";
import { ContainerLike, Inject, InjectMeta } from "../../Container";
import { AbstractLoader } from "../../Loader";
import { ApplicationConfigRegisterKey } from "../../Application/ApplicationConfig";
import { normalize } from "path";

const { Parser } = require("confman/index");

/**
 * 配置注入处理函数
 * @param options 注入选项
 */
function configInjectHandler(container: ContainerLike, meta: InjectMeta) {
  const config = container.get(ApplicationConfigRegisterKey);
  return getByPath(config, String(meta.name));
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
    const { targetDir = "app:/configs" } = this.options;
    const file = normalize(`${this.app.resolvePath(targetDir)}/config`);
    const parser = new Parser({ env: this.app.env });
    const config = await parser.load(file);
    this.app.container.register(ApplicationConfigRegisterKey, {
      type: "value",
      value: config,
    });
  }
}
