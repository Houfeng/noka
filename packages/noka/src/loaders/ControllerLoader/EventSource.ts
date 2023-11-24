import { IncomingMessage, ServerResponse } from "http";
import { uuid } from "noka-utility";
import { EOL } from "os";

export type EventSourceOptions = {
  retry: number;
  serialize: "none" | "auto" | ((data: unknown) => string);
  onClose?: () => void;
};

export type EventSourceEmitOptions = Partial<
  Omit<EventSourceOptions, "onClose">
> & { id?: string };

function normalizeData(data: unknown, options: EventSourceOptions): string {
  const { serialize } = options;
  if (!serialize || serialize === "none") return String(data);
  if (serialize === "auto") return JSON.stringify(data);
  return serialize(data);
}

export class EventSource<
  T extends Record<string, any> = Record<string, string>,
> {
  private options: EventSourceOptions;

  constructor(options?: Partial<EventSourceOptions>) {
    this.options = { retry: 3000, serialize: "none", ...options };
  }

  private request?: IncomingMessage;
  private response?: ServerResponse<IncomingMessage>;
  private release?: () => void;
  private holding = new Promise<void>((resolve) => (this.release = resolve));

  /**
   * @internal
   */
  accept(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
  ): Promise<void> {
    const { onClose } = this.options;
    this.request = req;
    this.response = res;
    this.request.socket.setNoDelay(true);
    this.response.writeHead(200, {
      ["Connection"]: "Keep-Alive",
      ["Cache-Control"]: "no-cache",
      ["Content-Type"]: "text/event-stream",
    });
    this.request?.on("close", () => {
      this.response?.end();
      this.release?.();
      if (onClose) onClose();
    });
    return this.holding;
  }

  get url() {
    if (!this.request) return;
    return this.request.url;
  }

  close() {
    this.response?.end();
    this.release?.();
  }

  /**
   * 向 source 写入数据
   * @param data 数据
   * @returns
   */
  send<E extends keyof T>(
    event: E,
    data: T[E],
    options?: EventSourceEmitOptions,
  ) {
    if (!this.response) return;
    const composedOptions = { ...this.options, ...options };
    const { retry } = composedOptions;
    const id = uuid();
    const text = normalizeData(data, composedOptions);
    const content = { event, data: encodeURIComponent(text), id, retry };
    const message = Object.entries(content)
      .map(([key, value]) => `${String(key)}: ${String(value)}`)
      .join(EOL);
    this.response?.write(`${message}${EOL}${EOL}`);
  }
}
