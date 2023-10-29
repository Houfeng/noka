/** @format */

import { Controller, Get, View } from "noka";

@Controller("/")
export class HomeController {
  @Get("/*")
  @View("index")
  async index() {
    return {
      message: "Noka",
      env: process.env.NOKA_ENV,
    };
  }
}
