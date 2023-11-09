import compose from "koa-compose";
import serve from "koa-static";
import { AbstractLoader } from "../../Loader";
import { existsSync } from "fs";

const conditional = require("koa-conditional-get");
const etag = require("koa-etag");

export class StaticLoader extends AbstractLoader {
  public async load() {
    const { targetDir = "app:/assets" } = this.options;
    const staticRoot = this.app.resolvePath(targetDir);
    if (!existsSync(staticRoot)) return;
    this.app.server.use(async (ctx, next) => {
      await next();
      if (ctx.preventCache) return;
      const noop: any = () => {};
      await compose([conditional(), etag()])(ctx, noop);
    });
    this.app.server.use(serve(staticRoot));
    this.app.logger?.info("Static ready");
  }
}
