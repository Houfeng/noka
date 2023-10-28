import { AbstractLoader } from "../AbstractLoader";
import { ApplicationInterface } from "../Application";

/**
 * Setup 函数
 */
export type SetupFunction = (app?: ApplicationInterface) => Promise<any> | any;

/**
 * Setup 加载器
 */
export class SetupLoader extends AbstractLoader<{}, SetupFunction> {
  /**
   * 执行加载
   */
  async load() {
    await super.load();
    await Promise.all(
      this.content.map(async (func) => {
        const value = await func(this.app);
        this.container.registerValue(func.name, value);
      }),
    );
    this.app.logger.info("Setup ready");
  }
}
