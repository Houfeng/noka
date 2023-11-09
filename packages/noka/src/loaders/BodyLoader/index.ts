import { AbstractLoader } from "../../Loader";

const koaBody = require("koa-body");

export class BodyLoader extends AbstractLoader {
  watchable: boolean = false;
  public async load() {
    const options = { multipart: true, ...this.options };
    this.app.server.use(koaBody(options));
    this.app.logger?.info("Body ready");
  }
}
