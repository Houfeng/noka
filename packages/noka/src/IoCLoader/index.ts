import { AbstractLoader } from "../AbstractLoader/AbstractLoader";

/**
 * IoC 加载器
 */
export class IoCLoader extends AbstractLoader {
  /**
   * 加载指定类型到容器中
   */
  public async load() {
    await super.load();
    this.container.registerTypes(this.content);
  }
}
