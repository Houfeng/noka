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

  @Get("/demo")
  @Post("/demo")
  @View("demo")
  async demo(@Body("del") delId: string, @Body("add") isAdd: string) {
    if (isAdd) {
      await this.userService?.create();
    } else if (delId) {
      await this.userService?.remove(delId);
    }
    const items = await this.userService?.list();
    return { items };
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
