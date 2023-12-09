import { AbstractLoader, LoaderOptions } from "../../Loader";

export type HeaderLoaderOptions = LoaderOptions<{
  headers?: Record<string, string>;
}>;

/**
 * 响应头加载器
 */
export class HeaderLoader extends AbstractLoader<HeaderLoaderOptions> {
  /**
   * 配置默认响应头
   */
  public async load() {
    const options: HeaderLoaderOptions = { ...this.options };
    const headers: Record<string, string> = {
      server: "Noka",
      ...options.headers,
    };
    this.app.server.use(async (ctx, next) => {
      for (const key in headers) ctx.set(key, headers[key]);
      await next();
    });
    this.app.logger?.info("Header ready");
  }
}
