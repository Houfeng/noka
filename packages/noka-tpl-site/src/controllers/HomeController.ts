import { Controller, Get, Result, View } from "noka";

@Controller("/")
export class HomeController {
  constructor() {}

  @Get("/")
  @View("index")
  async index() {
    return Result.ok({ message: "Noka" });
  }
}
