/** @format */

import { Provider, InjectEntityRepository, ORM } from "noka";
import { User } from "../entities/User";
import { PagingOptions, PagingResult } from "./Paging";

@Provider()
export class UserService {
  @InjectEntityRepository(User)
  repo?: ORM.Repository<User>;

  async create(user: User) {
    return this.repo?.save(user);
  }

  async remove(id: string) {
    return this.repo?.delete(id);
  }

  async list(options: PagingOptions): Promise<PagingResult<User>> {
    const { skip, limit } = options;
    const items =
      (await this.repo
        ?.createQueryBuilder("user")
        .orderBy("user.id", "DESC")
        .skip(skip)
        .limit(limit)
        .getMany()) || [];
    const total = (await this.repo?.count()) || 0;
    return { items, total };
  }
}
