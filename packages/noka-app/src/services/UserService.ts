/** @format */

import { Provider, Repository, EntityRepo } from "noka";
import { User } from "../entities/User";

@Provider()
export class UserService {
  @EntityRepo(User)
  repo?: Repository<User>;

  async create() {
    const demo = new User();
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
