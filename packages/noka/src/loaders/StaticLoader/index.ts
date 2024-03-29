import compose from "koa-compose";
import serve from "koa-static";
import { AbstractLoader, LoaderOptions } from "../../Loader";
import { existsSync } from "fs";
import etag from "koa-etag";
import conditional from "koa-conditional-get";

export type StaticLoaderOptions = LoaderOptions<Omit<serve.Options, "root">>;

const defaultMaxAge = 1000 * 60 * 60 * 24;

export class StaticLoader extends AbstractLoader<StaticLoaderOptions> {
  public async load() {
    const { targetDir = "app:/public", ...others } = this.options;
    const staticRoot = this.app.resolvePath(targetDir);
    if (!existsSync(staticRoot)) return;
    this.app.router.get("/(.*)", async (ctx, next) => {
      if (ctx.preventCache || this.app.isSourceMode) return next();
      await compose([conditional(), etag()])(ctx, next);
    });
    const maxAge = this.app.isSourceMode ? 0 : defaultMaxAge;
    this.app.router.get("/(.*)", serve(staticRoot, { maxAge, ...others }));
    this.app.logger?.info("Static ready");
  }
}
