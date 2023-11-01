import { Controller, Get, Inject, Req, Request } from "noka";
import { ItemService } from "../services/ItemService";
import { readdir } from "fs/promises";
import { normalize, resolve } from "path";
// import { FSAnyEntity } from "../../shared/FSEntity";

@Controller("/api/libraries", 10000)
export class LibraryController {
  @Inject("ItemService")
  itemService: ItemService;

  @Get("/")
  @Get("/*")
  async list(@Req() req: Request) {
    const currentPath = normalize(req.path.replace('/api/libraries', '/'));
    const items = await readdir(resolve("~/", currentPath));
    return items;
    // const entities: FSAnyEntity[] = await Promise.all(
    //   items.map(async (path) => {
    //     const info = await stat(path);
    //     const type = info?.isDirectory?.() ? "folder" : "file";
    //     const name = basename(path || "");
    //     return { type, name, path };
    //   }),
    // );
    // return entities;
  }
}
