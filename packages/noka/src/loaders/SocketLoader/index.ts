import { LoaderOptions } from "../../Loader";
import { EntityConstructor } from "../../Container";
import { ProviderLoader } from "../ProviderLoader";
// import { WebSocketServer } from 'ws';

export type SocketOptions = LoaderOptions & {};
export type SocketController = EntityConstructor<{}>;

export class SocketLoader extends ProviderLoader<
  SocketOptions,
  SocketController
> {
  //ws = new WebSocketServer({ noServer: true });
  async load() {
    // TODO:// 待实现
    // await super.load();
    // if (this.items.length < 1) return;
  }
}
