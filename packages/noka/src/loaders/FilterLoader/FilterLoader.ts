import { AbstractLoader, LoaderOptions } from "../../Loader";
import { HttpContext } from "../../Application/ApplicationTypes";
import { BeanConstructor } from "../../Container";
import { getFilterMeta } from "./FilterMeta";
import { isNull } from "noka-utility";

export type FilterOptions = LoaderOptions & {};

export type FilterInstance = {
  handle: (ctx: HttpContext, next: () => Promise<any>) => any;
};

export type FilterConstructor = BeanConstructor<FilterInstance>;

const allMethods = ["GET", "POST", "DELETE", "PUT", "OPTION", "HEAD", "PATCH"];

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
        router.register(meta.path, allMethods, async (ctx, next) => {
          const filter = new Filter();
          container.inject(filter);
          ctx.preventCache = true;
          const result = await filter.handle(ctx, next);
          if (!isNull(result)) ctx.body = result;
        });
      });
    logger?.info("Filter ready");
  }
}
