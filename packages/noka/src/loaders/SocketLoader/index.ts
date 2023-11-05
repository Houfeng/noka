import { AbstractLoader, LoaderOptions } from "../../Loader";
import { BeanConstructor } from "../../Container";
// import { WebSocketServer } from 'ws';

export type SocketOptions = LoaderOptions & {};
export type SocketController = BeanConstructor<{}>;

export class SocketLoader extends AbstractLoader<
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
