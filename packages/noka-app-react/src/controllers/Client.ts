import { Controller, Sse } from "noka";
import { clientManger } from "../models/ClientManger";

@Controller("/api/client", 10000)
export class ClientController {
  @Sse("/subscribe")
  async subscribe() {
    return clientManger.accept();
  }
}
