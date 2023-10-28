import session from "koa-session";
import { AbstractLoader } from "../../Loader";
import { pkg, uuid } from "../../common/utils";
import { Context } from "../ControllerLoader";

export const Session = () => Context("session");

const defaultOptions: any = {
  key: pkg.displayName.toUpperCase(),
  maxAge: 86400000,
};

const SIGN_KEYS: string[] = [uuid()];

/**
 * Session 加载器
 */
export class SessionLoader extends AbstractLoader {
  /**
   * 加载 Session
   */
  public async load() {
    const options = { ...defaultOptions, ...this.options };
    this.app.server.keys = options.keys || SIGN_KEYS;
    this.app.server.use(session(options, this.app.server));
    this.app.logger?.info("Session ready");
  }
}
