/** @format */

import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  View,
  Sse,
  Session,
  EventSourceManager,
} from "noka";
import { UserService } from "../services/UserService";

const eventSourceManager = new EventSourceManager();

setInterval(() => {
  eventSourceManager.send("u3", "test", "u3:" + String(Date.now()));
}, 2000);

@Controller("/")
export class HomeController {
  constructor() {}

  @Get("/")
  @View("index")
  async index() {
    return Controller.Result({ message: "Noka" }, 404);
  }

  @Inject()
  userService?: UserService;

  @Get("/users")
  @Post("/users")
  @View("users")
  async users(@Body("del") delId: string, @Body("add") isAdd: string) {
    if (isAdd) {
      await this.userService?.create();
    } else if (delId) {
      await this.userService?.remove(delId);
    }
    const items = await this.userService?.list();
    return { items };
  }

  @Inject("demo")
  demoMessage?: string;

  @Get("/demo")
  async demo(@Session() session: Record<string, any>) {
    session["test"] = "test";
    return this.demoMessage;
  }

  @Get("/sse")
  @View("sse")
  async sse() {
    return {};
  }

  @Sse("/sub")
  async sub() {
    return eventSourceManager.accept("u1");
  }
}
