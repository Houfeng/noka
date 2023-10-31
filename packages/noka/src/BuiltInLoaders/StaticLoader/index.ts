import compose from "koa-compose";
import serve from "koa-static";
import { AbstractLoader } from "../../Loader";
import { existsSync } from "fs";

const conditional = require("koa-conditional-get");
const etag = require("koa-etag");

/**
 * 静态资源 加载器
 */
export class StaticLoader extends AbstractLoader {
  /**
   * 加载静态资源相关模块
   */
  public async load() {
    const { path } = this.options;
    const staticRoot = this.app.resolvePath(path);
    if (!existsSync(staticRoot)) return;
    this.app.server.use(async (ctx, next) => {
      await next();
      if (ctx.preventCache) return;
      const noopNext: any = () => { };
      await compose([conditional(), etag()])(ctx, noopNext);
    });
    this.app.server.use(serve(staticRoot));
    this.app.logger?.info("Static ready");
  }
}
