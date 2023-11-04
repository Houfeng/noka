import { EventSource } from "noka";

export class ClientManger<T extends Record<string, any> = Record<string, any>> {
  clients: EventSource<T>[] = [];

  accept() {
    const client = new EventSource<T>({
      serialize: "auto",
      onClose: () => {
        this.clients = this.clients.filter((it) => it !== client);
      },
    });
    this.clients.push(client);
    return client;
  }

  broadcast<E extends keyof T>(event: E, data: T[E]) {
    this.clients.forEach((it) => it.send(event, data));
  }
}

export const clientManger = new ClientManger();
