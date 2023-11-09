import { AbstractLoader, LoaderOptions } from "../../Loader";

export type HeaderLoaderOptions = LoaderOptions<Record<string, string>>;

/**
 * 响应头加载器
 */
export class HeadersLoader extends AbstractLoader<HeaderLoaderOptions> {
  watchable: boolean = false;
  /**
   * 配置默认响应头
   */
  public async load() {
    const headers: HeaderLoaderOptions = { server: "Noka", ...this.options };
    this.app.server.use(async (ctx, next) => {
      for (const key in headers) ctx.set(key, headers[key]);
      await next();
    });
    this.app.logger?.info("Headers ready");
  }
}
