import { Controller, Get, HttpRequest, Post, Req } from "noka";
import { homedir } from "os";
import { FSLibrary } from "../models/FSLibrary";
import { PhotoManger } from "../models/PhotoManager";

const library = new FSLibrary(homedir());
const photoManger = new PhotoManger({ library });

@Controller("/api/libraries", 10000)
export class LibraryController {
  @Get("/")
  @Get("/*")
  async list(@Req() req: HttpRequest) {
    const prefix = "/api/libraries";
    const path = req.path.replace(prefix, "");
    const info = await library.child(path);
    if (!info) return { error: "Not found" };
    const children = await info.children();
    return { info, children };
  }

  @Post("/~indexing")
  async indexing() {
    photoManger.startIndexing();
  }
}
