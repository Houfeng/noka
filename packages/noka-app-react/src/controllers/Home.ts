import { Controller, Get, View } from "noka";
import { getClientAssets } from "../models/ClientAssets";

const { NOKA_ENV } = process.env;

@Controller("/")
export class HomeController {
  @Get("/*")
  @View("index")
  async index() {
    const assets = await getClientAssets();
    return { NOKA_ENV, assets };
  }
}
