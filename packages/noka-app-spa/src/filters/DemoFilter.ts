import { HttpContext, Filter } from "noka";

@Filter("/")
export class Demo {
  async handle(ctx: HttpContext, next: () => Promise<any>) {
    ctx.logger?.debug(`Current request: ${ctx.URL}`, next);
    await next();
  }
}
