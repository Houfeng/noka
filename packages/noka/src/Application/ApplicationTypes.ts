import Koa from "koa";
import Router from "koa-router";
import { type Request, type Response, type ParameterizedContext } from "koa";
import { type Session } from "koa-session";
import { type ApplicationLogger } from "./ApplicationLogger";
import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";

export type HttpSession = Session;
export type NokaSession = HttpSession;

export type HttpContextState = {};
export type NokaContextState = HttpContextState;

export type HttpContextExtends = {
  logger: ApplicationLogger;
  session: HttpSession;
  preventCache?: boolean;
};

export type NokaContextExtends = HttpContextExtends;

export class HttpServer<
  S extends HttpContextState = HttpContextState,
  C extends HttpContextExtends = HttpContextExtends,
> extends Koa<S, C> {}

export const NokaServer = HttpServer;

export type HttpRequest = Request;
export type NokaRequest = HttpRequest;

export type HttpResponse = Response;
export type NokaResponse = HttpResponse;

export type HttpContext<
  S extends HttpContextState = HttpContextState,
  C extends HttpContextExtends = HttpContextExtends,
> = ParameterizedContext<S, C>;

export type HttpCookies = HttpContext["cookies"];
export type NokaCookies = HttpCookies;

export type NokaContext<
  S extends HttpContextState = HttpContextState,
  C extends HttpContextExtends = HttpContextExtends,
> = HttpContext<S, C>;

export class HttpRouter<
  S extends HttpContextState = HttpContextState,
  C extends HttpContextExtends = HttpContextExtends,
> extends Router<S, C> {}

export const NokaRouter = HttpRouter;

export type HttpRequestHeaders = IncomingHttpHeaders;
export type HttpResponseHeaders = OutgoingHttpHeaders;
export type NokaRequestHeaders = HttpRequestHeaders;
export type NokaResponseHeaders = HttpResponseHeaders;

export class HttpResult<T> {
  constructor(
    public status: number,
    public body: T,
    public headers?: HttpResponseHeaders,
  ) {}

  /**
   * @internal
   */
  writeTo(ctx: HttpContext) {
    ctx.status = this.status;
    ctx.body = this.body;
    if (this.headers) Object.assign(ctx.headers, this.headers);
  }

  /**
   * @internal
   */
  static is(value: unknown): value is HttpResult<unknown> {
    return value instanceof HttpResult;
  }

  static ok<T>(body: T, headers?: HttpResponseHeaders) {
    return new HttpResult(200, body, headers);
  }

  static created(location: string, headers?: HttpResponseHeaders) {
    return new HttpResult(201, null, { ...headers, location });
  }

  static accepted<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(202, body, headers);
  }

  static noContent(headers?: HttpResponseHeaders) {
    return new HttpResult(204, null, headers);
  }

  static resetContent(headers?: HttpResponseHeaders) {
    return new HttpResult(205, null, headers);
  }

  static partial<T>(body: T, headers?: HttpResponseHeaders) {
    return new HttpResult(206, body, headers);
  }

  static redirect(
    location: string,
    status: 301 | 302 | 303 | 307 | 308 = 302,
    headers?: HttpResponseHeaders,
  ) {
    return new HttpResult<null>(status, null, { ...headers, location });
  }

  static badRequest<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(400, body, headers);
  }

  static unauthorized<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(401, body, headers);
  }

  static forbidden<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(403, body, headers);
  }

  static notFound<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(404, body, headers);
  }

  static methodNotAllowed<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(405, body, headers);
  }

  static error<T>(body?: T, headers?: HttpResponseHeaders) {
    return new HttpResult(500, body, headers);
  }
}

export const NokaResult = HttpResult;
export const Result = HttpResult;
