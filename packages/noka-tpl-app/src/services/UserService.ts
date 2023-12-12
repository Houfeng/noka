import { Provider } from "noka";
import { User } from "../entities/User";
import { PagingOptions, PagingResult } from "./Paging";
import { InjectEntityRepository, Repository } from "noka-orm";

@Provider()
export class UserService {
  @InjectEntityRepository(User)
  repo?: Repository<User>;

  async create() {
    const demo = new User();
    demo.account = "test";
    demo.name = "test";
    demo.password = "test";
    demo.phone = "test";
    demo.email = "test";
    demo.avatar = "test";
    return this.repo?.save(demo);
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
