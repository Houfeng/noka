/** @format */

import { Provider, ORM, InjectEntityRepository } from "noka";
import { User } from "../entities/User";

@Provider()
export class UserService {
  @InjectEntityRepository(User)
  repo?: ORM.Repository<User>;

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
