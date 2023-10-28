/** @format */

import { Controller, Get, Inject, Body, Post, View } from "noka";
import { ItemService } from "../services/Hello";

@Controller("/")
export class HelloController {
  @Inject("itemService")
  itemService: ItemService;

  @Get("/")
  @Post("/")
  @View("index")
  async index(@Body("remove") removeId: string, @Body("create") add: string) {
    if (add) await this.itemService.create();
    if (removeId) await this.itemService.remove(removeId);
    const items = await this.itemService.list();
    return { items };
  }
}
