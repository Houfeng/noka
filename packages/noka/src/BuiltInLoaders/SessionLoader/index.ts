import session from "koa-session";
import { AbstractLoader } from "../../Loader";
import { uuid } from "noka-utility";
import { Ctx } from "../ControllerLoader";

export { type Session as ContextSession } from 'koa-session';

export const Session = () => Ctx("session");

const SIGN_KEYS: string[] = [uuid()];

type SessionLoaderOptions = {
  keys?: string[];
}

/**
 * Session 加载器
 */
export class SessionLoader extends AbstractLoader<SessionLoaderOptions> {
  public async load() {
    const options = {
      key: this.app.name.toUpperCase(),
      maxAge: 86400000,
      ...this.options,
    };
    this.app.server.keys = options.keys || SIGN_KEYS;
    this.app.server.use(session(options, this.app.server));
    this.app.logger?.info("Session ready");
  }
}
