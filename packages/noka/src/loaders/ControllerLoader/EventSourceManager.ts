import { FastBus, FastBusOptions } from "fastbus";
import {
  EventSource,
  EventSourceEmitOptions,
  EventSourceOptions,
} from "./EventSource";

export type EventSourceManagerOptions = {
  source: Partial<EventSourceOptions>;
  bus: Partial<FastBusOptions>;
};

export class EventSourceManager<
  T extends Record<string, any> = Record<string, string>,
> {
  /**
   * 用于多进程或多服务间同步消息的 fastbus 实例
   */
  private bus: FastBus<{
    message: (
      name: string,
      event: string,
      data: any,
      options?: EventSourceEmitOptions,
    ) => void;
  }>;

  /**
   * 所有已连接的 EventSource 客户端（浏览器）
   */
  private clients = new Set<[string, EventSource<T>]>();

  /**
   * EventSourceManager 选项
   */
  private options: EventSourceManagerOptions;

  /**
   * 构造一个 EventSourceManager 实例
   * 通常一个应用中只需有一个 EventSourceManager 实例
   * @param options EventSourceManager 选项
   */
  constructor(options?: Partial<EventSourceManagerOptions>) {
    this.options = {
      source: { ...options?.source },
      bus: { ...options?.bus },
      ...options,
    };
    this.bus = new FastBus(this.options.bus);
    this.bus.on("message", this.handle);
  }

  /** 处理消息总线发送过来的消息，包括本机本进程的 */
  private handle = (
    name: string,
    event: string,
    data: any,
    options?: EventSourceEmitOptions,
  ) => {
    Array.from(this.clients)
      .filter((it) => !name || it[0] === name)
      .forEach(([, source]) => {
        source.send(event, data, options);
      });
  };

  /**
   * 接受一个来自客户端的 SSE 连接
   * @param name 用户标识
   * @returns
   */
  accept(name: string) {
    const client: [string, EventSource<T>] = [
      name,
      new EventSource<T>({
        ...this.options.source,
        onClose: () => this.clients.delete(client),
      }),
    ];
    this.clients.add(client);
    return client[1];
  }

  /**
   * 向指定的 source 发送数据
   * @param name 用户标识
   * @param data 数据
   * @returns
   */
  send<E extends Exclude<keyof T, number | symbol>>(
    name: string,
    event: E,
    data: T[E],
    options?: EventSourceEmitOptions,
  ) {
    this.bus.emit("message", name, event, data, options);
  }

  /**
   * 向所有 source 广播数据
   * @param data 数据
   * @returns
   */
  broadcast<N extends Exclude<keyof T, number | symbol>>(
    event: N,
    data: T[N],
    options?: EventSourceEmitOptions,
  ) {
    this.bus.emit("message", "", event, data, options);
  }
}
