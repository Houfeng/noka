import { Controller, Get, HttpRequest, Req, View } from "noka";
import { getClientInitialAssets } from "../models/ClientAssets";

const { NOKA_ENV = "production" } = process.env;

@Controller("/")
export class HomeController {
  @Get("/*")
  @View("index")
  async index(@Req() req: HttpRequest) {
    const assets = await getClientInitialAssets(req.hostname);
    return { NOKA_ENV, assets };
  }
}
