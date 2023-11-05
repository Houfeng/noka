import { HttpContext, Filter } from "noka";

@Filter("/")
export class Demo {
  handle(ctx: HttpContext) {
    return `Current request: ${ctx.URL}`;
  }
}
