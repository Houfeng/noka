import { Controller, Get, Inject, Req, Request } from "noka";
import { ItemService } from "../services/ItemService";
import { homedir } from "os";
import { FSLibrary } from "../models/FS/FSLibrary";

const library = new FSLibrary(homedir());

@Controller("/api/libraries", 10000)
export class LibraryController {
  @Inject("ItemService")
  itemService: ItemService;

  @Get("/")
  @Get("/*")
  async list(@Req() req: Request) {
    const prefix = "/api/libraries";
    const path = req.path.replace(prefix, "");
    const info = await library.child(path);
    if (!info) return { error: "Not found" };
    const children = await info.children();
    return { info, children };
  }
}
