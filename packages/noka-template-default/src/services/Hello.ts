import { Provider, Repository, Repo } from "noka";
import { Item } from "../models/Item";

@Provider("itemService")
export class ItemService {
  @Repo(Item)
  repo: Repository<Item>;

  async create() {
    const demo = new Item();
    demo.name = "test";
    return this.repo.save(demo);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }

  async list() {
    return this.repo
      .createQueryBuilder("item")
      .orderBy("item.id", "DESC")
      .skip(0)
      .limit(10)
      .getMany();
  }
}
