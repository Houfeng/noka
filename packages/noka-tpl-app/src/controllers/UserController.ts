import { Controller, Del, Get, Inject, Param, Post, Query } from "noka";
import { UserService } from "../services/UserService";

@Controller("/api", 10000)
export class UserController {
  @Inject()
  userService?: UserService;

  @Post("/users")
  async users() {
    await this.userService?.create();
    return {};
  }

  @Get("/users")
  async list(@Query("skip") skip = 0, @Query("limit") limit = 10) {
    return this.userService?.list({ skip, limit });
  }

  @Del("/user/:id")
  async remove(@Param() id: number) {
    return this.userService?.remove(id);
  }
}
