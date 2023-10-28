import { IoCLoader } from "../IoCLoader";

/**
 * service 加载器
 */
export class ServiceLoader extends IoCLoader {
  async load() {
    await super.load();
    this.app.logger?.info("Service ready");
  }
}
