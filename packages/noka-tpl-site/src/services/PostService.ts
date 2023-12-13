import { Provider } from "noka";
import { Post } from "../entities/Post";
import { InjectEntityRepository, Repository } from "noka-orm";

@Provider()
export class PostService {
  @InjectEntityRepository(Post)
  repo?: Repository<Post>;

  async create() {
    const demo = new Post();
    demo.title = "test";
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
