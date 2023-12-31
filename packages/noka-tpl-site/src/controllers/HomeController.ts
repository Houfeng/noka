import { Controller, Get, Result, View } from "noka";

@Controller("/")
export class HomeController {
  constructor() {}

  @Get("/")
  @View("index")
  async index() {
    //return { message: "Noka" };
    //return Result.redirect("https://noka.site");
    return Result.ok({ message: "Noka" });
  }
}
