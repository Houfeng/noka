/** @format */

import { Controller, Get, Inject } from "noka";
import { ItemService } from "../services/ItemService";

@Controller("/api")
export class HomeController {
  @Inject("ItemService")
  itemService: ItemService;

  @Get("/items")
  async list() {
    const items = await this.itemService.list();
    return { items };
  }
}
