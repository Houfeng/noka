import { ProviderLoader } from "../ProviderLoader";

/**
 * service 加载器
 */
export class ServiceLoader extends ProviderLoader {
  async load() {
    await super.load();
    this.app.logger?.info("Service ready");
  }
}
