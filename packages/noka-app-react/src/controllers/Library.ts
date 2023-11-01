import { Controller, Get, Inject, Request } from "noka";
import { ItemService } from "../services/ItemService";
import { readdir, stat } from "fs/promises";
import { basename, resolve } from "path";
import { FSAnyEntity } from "../../shared/FSEntity";

@Controller("/api/libraries", 10000)
export class LibraryController {
  @Inject("ItemService")
  itemService: ItemService;

  @Get("/")
  @Get("/*")
  async list(req: Request) {
    const currentPath = req.path;
    const items = await readdir(resolve("~/", currentPath));
    const entities: FSAnyEntity[] = await Promise.all(
      items.map(async (path) => {
        const info = await stat(path);
        const type = info?.isDirectory?.() ? "folder" : "file";
        const name = basename(path || "");
        return { type, name, path };
      }),
    );
    return entities;
  }
}
