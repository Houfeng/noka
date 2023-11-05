import { ProviderLoader } from "../ProviderLoader";

/**
 * model 加载器
 */
export class ModelLoader extends ProviderLoader {
  async load() {
    await super.load();
    this.app.logger?.info("Model ready");
  }
}
