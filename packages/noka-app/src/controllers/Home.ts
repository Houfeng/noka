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
  HttpSession,
  Param,
} from "noka";
import { UserService } from "../services/UserService";
import { Demo } from "../setups/DemoSetup";

const eventSourceManager = new EventSourceManager();

setInterval(() => {
  eventSourceManager.send("u1", "test", "u1:" + String(Date.now()));
}, 5000);

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

  @Inject(Demo)
  demoMessage?: string;

  @Get("/demo")
  async demo(@Session() session: HttpSession) {
    session["test"] = "test";
    return this.demoMessage;
  }

  @Get("/demo2/:id")
  async demo2(@Param("id") id1: string, @Param("id") id2: number) {
    return { id1, id2 };
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
