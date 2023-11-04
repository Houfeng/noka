import { LoaderOptions } from "../../Loader";
import { EntityConstructor } from "../../Container";
import { ProviderLoader } from "../ProviderLoader";

export type SocketOptions = LoaderOptions & {};
export type SocketController = EntityConstructor<{}>;

export class SocketLoader extends ProviderLoader<
  SocketOptions,
  SocketController
> {
  async load() {
    await super.load();
  }
}
