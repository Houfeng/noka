import { LoaderOptions } from "../../Loader";
import { EntityConstructor } from "../../Container";
import { ProviderLoader } from "../ProviderLoader";

export type SocketOptions = LoaderOptions & {};
export type SocketController = EntityConstructor<{}>;

export class SocketLoader extends ProviderLoader<
  SocketOptions,
  SocketController
> {
  bindApp() {
    this.app.listener;
  }

  async load() {
    await super.load();
    this.bindApp();
  }
}
