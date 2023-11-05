import { AbstractLoader, LoaderOptions } from "../../Loader";
import { HttpContext } from "../../Application/ApplicationTypes";
import { JSONValue } from "noka-utility";
import { BeanConstructor } from "../../Container";
import { getFilterMeta } from "./FilterMeta";

export type FilterOptions = LoaderOptions & {};

export type FilterInstance = {
  handle: (ctx?: HttpContext) => boolean | JSONValue;
};

export type FilterConstructor = BeanConstructor<FilterInstance>;

const allMethods = ["GET", "POST", "DELETE", "PUT", "OPTION", "PATCH"];

export class FilterLoader extends AbstractLoader<
  FilterOptions,
  FilterConstructor
> {
  async load() {
    await super.load();
    const { router, container, logger } = this.app;
    this.items
      .map((Filter) => ({ Filter, meta: getFilterMeta(Filter) }))
      .filter((it) => !!it.Filter && !!it.meta)
      .sort((a, b) => b.meta.priority - a.meta.priority)
      .forEach(async ({ Filter, meta }) => {
        router.register(meta.path, allMethods, async (ctx) => {
          const filter = new Filter();
          container.inject(filter);
          filter.handle(ctx);
        });
      });
    logger?.info("Filter ready");
  }
}
