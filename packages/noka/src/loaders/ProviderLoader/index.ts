import { AbstractLoader } from "../../Loader/AbstractLoader";
import { EntityConstructor } from "../../Container/EntityInfo";
import { LoaderOptions } from "../../Loader/LoaderOptions";

/**
 * IoC 加载器
 */
export class ProviderLoader<
  T extends LoaderOptions = LoaderOptions,
  C extends EntityConstructor<any> = EntityConstructor<any>,
> extends AbstractLoader<T, C> {
  public async load() {
    await super.load();
    this.items.forEach((it) => this.app.container.registryProvider(it, true));
  }
}
