import { AbstractLoader } from "../../Loader/AbstractLoader";
import { getProviderMetadata } from '../../Container/Provider';
import { EntityConstructor } from "../../Container/EntityInfo";
import { LoaderOptions } from "../../Loader/LoaderOptions";

/**
 * IoC 加载器
 */
export class IoCLoader<
  T extends LoaderOptions = LoaderOptions,
  C = unknown,
> extends AbstractLoader<T, C>{
  /**
   * 加载指定类型到容器中
   */
  public async load() {
    await super.load();
    this.content.forEach(value => {
      const meta = getProviderMetadata(value);
      if (meta.options.static) {
        this.container.register(meta.name, {
          type: "value",
          value: value,
        });
      } else {
        this.container.register(meta.name, {
          type: "class",
          value: value as EntityConstructor<any>,
          cacheable: meta.options?.singleton
        });
      }
    });
  }
}
