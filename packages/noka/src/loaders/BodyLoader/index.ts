import { AbstractLoader } from "../../Loader";

const koaBody = require("koa-body");

/**
 * 请求主体解析 loader
 */
export class BodyLoader extends AbstractLoader {
  /**
   * 配置默认响应头
   */
  public async load() {
    const options = { multipart: true, ...this.options };
    this.app.server.use(koaBody(options));
    this.app.logger?.info("Body ready");
  }
}
