/** @format */

import {
  Controller,
  Get,
  Inject,
  Body,
  Post,
  View,
  Sse,
  EventSource,
  Session,
} from "noka";
import { UserService } from "../services/UserService";

@Controller("/")
export class HomeController {
  @Get("/")
  @View("index")
  async index() {
    return { message: "Noka" };
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

  @Sse("/sub")
  async sub() {
    const source = new EventSource();
    setInterval(() => {
      source.send("test", String(Date.now()));
    }, 2000);
    return source;
  }
}
