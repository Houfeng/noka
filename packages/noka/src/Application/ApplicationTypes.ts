import Koa from "koa";
import Router from "koa-router";
import { type Request, type Response, type ParameterizedContext } from "koa";
import { type LoggerLike } from "../loaders/LoggerLoader";
import { type Session } from "koa-session";

export type HttpSession = Session;
export type NokaSession = HttpSession;

export type HttpContextState = {};
export type NokaContextState = HttpContextState;

export type HttpContextExtends = {
  logger: LoggerLike;
  session: HttpSession;
  preventCache: boolean;
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

export type NokaContext<
  S extends HttpContextState = HttpContextState,
  C extends HttpContextExtends = HttpContextExtends,
> = HttpContext<S, C>;

export class HttpRouter<
  S extends HttpContextState = HttpContextState,
  C extends HttpContextExtends = HttpContextExtends,
> extends Router<S, C> {}

export const NokaRouter = HttpRouter;
