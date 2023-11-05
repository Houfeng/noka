import { type Request, type Response, type ParameterizedContext } from "koa";
import { LoggerLike } from "../loaders/LoggerLoader";

export type HttpRequest = Request;
export type HttpResponse = Response;

export type NokaRequest = HttpRequest;
export type NokaResponse = HttpResponse;

export type HttpContext = ParameterizedContext<
  {},
  {
    logger?: LoggerLike;
    session?: Record<string, any>;
    preventCache?: boolean;
  }
>;

export type NokaContext = HttpContext;
