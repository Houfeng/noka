/** @format */

import { Provider, Repository, EntityRepo } from "noka";
import { Item } from "../entities/Item";

@Provider()
export class ItemService {
  @EntityRepo(Item)
  repo: Repository<Item> | undefined;

  async create() {
    const demo = new Item();
    demo.name = "test";
    return this.repo?.save(demo);
  }

  async remove(id: string) {
    return this.repo?.delete(id);
  }

  async list() {
    return this.repo
      ?.createQueryBuilder("item")
      .orderBy("item.id", "DESC")
      .skip(0)
      .limit(10)
      .getMany();
  }
}
