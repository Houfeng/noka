/** @format */

import { Controller, Get, Inject, Body, Post, View } from "noka";
import { ItemService } from "../services/Hello";

@Controller("/")
export class HomeController {
  @Get("/")
  @View("index")
  async index() {
    return { message: "Noka" };
  }

  @Inject("ItemService")
  itemService: ItemService;

  @Get("/demo")
  @Post("/demo")
  @View("demo")
  async demo(@Body("del") delId: string, @Body("add") isAdd: string) {
    if (isAdd) {
      await this.itemService.create();
    } else if (delId) {
      await this.itemService.remove(delId);
    }
    const items = await this.itemService.list();
    return { items };
  }
}
