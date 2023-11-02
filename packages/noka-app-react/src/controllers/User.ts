import { Controller, Get, Inject, Query } from "noka";
import { UserService } from "../services/UserService";

@Controller("/api/users", 10000)
export class UserController {
  @Inject("UserService")
  userService?: UserService;

  @Get("/")
  async list(@Query("skip") skip = 0, @Query("limit") limit = 10) {
    return this.userService?.list({ skip, limit });
  }
}
