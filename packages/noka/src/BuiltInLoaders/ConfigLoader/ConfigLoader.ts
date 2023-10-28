import { AbstractLoader } from "../../Loader";
import { CONFIG_ENTITY_KEY } from "./constants";
import { resolve } from "path";

const { Parser } = require("confman/index");

/**
 * 配置加载器
 */
export class ConfigLoader extends AbstractLoader {
  /**
   * 加载应用配置
   */
  public async load() {
    const { root } = this.app;
    const { path } = this.options;
    const configPath = resolve(root, path);
    const configParser = new Parser({ env: this.env });
    const configObject = await configParser.load(configPath);
    this.container.registerValue(CONFIG_ENTITY_KEY, configObject);
    this.watchBy([`${configPath}.*`, `${configPath}/**/*.*`]);
  }
}
