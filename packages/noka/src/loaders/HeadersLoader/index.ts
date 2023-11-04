import { AbstractLoader } from "../../Loader";

/**
 * 响应头加载器
 */
export class HeadersLoader<
  T extends Record<string, string> = Record<string, string>,
> extends AbstractLoader<T> {
  /**
   * 配置默认响应头
   */
  public async load() {
    const headers = { server: "Noka", ...this.options };
    this.app.server.use(async (ctx, next) => {
      for (const key in headers) ctx.set(key, headers[key]);
      await next();
    });
    this.app.logger?.info("Headers ready");
  }
}
