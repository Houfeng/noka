import { AbstractLoader } from "../AbstractLoader";
import { pkg } from "../common/utils";

const defaultOptions: { [key: string]: string } = { Server: pkg.displayName };

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
    const headers = { ...defaultOptions, ...this.options };
    this.server.use(async (ctx, next) => {
      for (const key in headers) ctx.set(key, headers[key]);
      await next();
    });
    this.app.logger.info("Headers ready");
  }
}
