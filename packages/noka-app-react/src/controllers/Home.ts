import { Controller, Get, HttpRequest, Req, View } from "noka";
import { getClientAssets } from "../models/ClientAssets";

const { NOKA_ENV = "production" } = process.env;

@Controller("/")
export class HomeController {
  @Get("/*")
  @View("index")
  async index(@Req() req: HttpRequest) {
    const assets = await getClientAssets(req.hostname);
    return { NOKA_ENV, assets };
  }
}
