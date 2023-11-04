import { LoaderOptions } from "../../Loader";
import { EntityConstructor } from "../../Container";
import { ProviderLoader } from "../ProviderLoader";
import { Server } from "socket.io";

export type SocketOptions = LoaderOptions & {};
export type SocketController = EntityConstructor<{}>;

export class SocketLoader extends ProviderLoader<
  SocketOptions,
  SocketController
> {
  io?: Server;
  bindApp() {
    this.io = new Server(this.app.listener);
  }

  async load() {
    await super.load();
    this.bindApp();
  }
}
