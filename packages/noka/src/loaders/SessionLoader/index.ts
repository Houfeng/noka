import session from "koa-session";
import { AbstractLoader } from "../../Loader";
import { uuid } from "noka-utility";
import { Ctx } from "../ControllerLoader";

export { type Session as ContextSession } from "koa-session";

const signKeys: string[] = [uuid()];
const cookieName = "NOKA-SID";

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;

export type SessionLoaderOptions = {
  signKeys?: string[];
};

export class SessionLoader extends AbstractLoader<SessionLoaderOptions> {
  public async load() {
    const options = {
      key: cookieName,
      signKeys: signKeys,
      maxAge: 1 * hour,
      renew: true,
      ...this.options,
    };
    this.app.server.keys = options.signKeys;
    this.app.server.use(session(options, this.app.server));
    this.app.logger?.info("Session ready");
  }
}

export const Session = () => Ctx("session");
