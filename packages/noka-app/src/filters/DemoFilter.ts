import { HttpContext, Filter } from "noka";

@Filter(["/demo"])
export class Demo {
  async handle(ctx: HttpContext, next: () => Promise<any>) {
    ctx.logger?.debug(`Current request: ${ctx.URL}`);
    await next();
  }
}
