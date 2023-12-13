import { Controller, Get, Inject, Body, Post, View } from "noka";
import { PostService } from "../services/PostService";

@Controller("/posts")
export class PostController {
  constructor() {}

  @Inject()
  postService?: PostService;

  @Get("/")
  @Post("/")
  @View("posts")
  async posts(@Body("del") delId: string, @Body("add") isAdd: string) {
    if (isAdd) {
      await this.postService?.create();
    } else if (delId) {
      await this.postService?.remove(delId);
    }
    const items = await this.postService?.list();
    return { items };
  }
}
