import { AbstractLoader, LoaderOptions } from "../../Loader";
import { HttpContext } from "../../Application/ApplicationTypes";
import { BeanConstructor } from "../../Container";
import { getFilterMeta } from "./FilterMeta";

export type FilterOptions = LoaderOptions;

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
    const { router, container, logger } = this.app;
    (await this.loadModules())
      .map((Filter) => ({ Filter, meta: getFilterMeta(Filter) }))
      .filter((it) => !!it.Filter && !!it.meta)
      .sort((a, b) => b.meta.priority - a.meta.priority)
      .forEach(async ({ Filter, meta }) => {
        const handler = async (ctx: HttpContext, next: () => Promise<void>) => {
          const filterInstance = new Filter();
          container.inject(filterInstance);
          ctx.preventCache = true;
          await filterInstance.handle(ctx, next);
        };
        const paths = Array.isArray(meta.path) ? meta.path : [meta.path];
        paths.forEach((path) => router.register(path, allMethods, handler));
      });
    logger?.info("Filter ready");
  }
}
