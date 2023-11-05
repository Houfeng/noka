import { AbstractLoader } from "../../Loader/AbstractLoader";
import { BeanConstructor } from "../../Container/BeanInfo";
import { LoaderOptions } from "../../Loader/LoaderOptions";

/**
 * IoC 加载器
 */
export class ProviderLoader<
  T extends LoaderOptions = LoaderOptions,
  C extends BeanConstructor = BeanConstructor,
> extends AbstractLoader<T, C> {
  public async load() {
    await super.load();
    this.items.forEach((it) => this.app.container.registryProvider(it, true));
  }
}
