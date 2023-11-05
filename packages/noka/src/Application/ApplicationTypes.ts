import { type Request, type Response, type ParameterizedContext } from "koa";

export type HttpRequest = Request;
export type HttpResponse = Response;

export type NokaRequest = HttpRequest;
export type NokaResponse = HttpResponse;

export type HttpContext = ParameterizedContext & {
  preventCache?: boolean;
};

export type NokaContext = HttpContext;
