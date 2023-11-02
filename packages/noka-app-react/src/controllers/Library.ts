import { Controller, Get, Req, Request } from "noka";
import { homedir } from "os";
import { FSLibrary } from "../models/FS/FSLibrary";

const library = new FSLibrary(homedir());

@Controller("/api/libraries", 10000)
export class LibraryController {
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
