import { isFunction } from "noka-util";
import { HttpCookies } from "../../Application/ApplicationTypes";

export const contextMetaKey = Symbol("Context");

export type ContextValueParser = (
  value: unknown,
  target: object,
  member: string,
  meta: ContextMeta,
) => unknown;

/**
 * 请求上下文注入映射信息
 */
export type ContextMeta = {
  // 暂时 context 只允许注入到方法参数，未来或考虑 controller 的属性
  type: "parameter";
  name: string;
  index: number;
  parse?: ContextValueParser;
};

/**
 * 获取控制器方法的参数注入信息
 * @param target 控制器
 * @param member 控制器方法名
 */
export function getContextMeta(target: object, member: string) {
  const list = Reflect.getMetadata(contextMetaKey, target, member) || [];
  return list as ContextMeta[];
}

/**
 * 从 ctx 上获取内容
 * @alias Context
 * @param name JSON Path
 */
export function Ctx(name = ".", parse?: ContextValueParser) {
  return (target: object, member: string, index: number) => {
    const type = "parameter";
    const list = getContextMeta(target, member);
    list.push({ type, name, index, parse });
    Reflect.metadata(contextMetaKey, list)(target, member);
  };
}

/**
 * @alias Ctx
 */
export const Context = Ctx;

/**
 * 针对 URL 中的「路由参数」和「查询字符串」，自动做类型转换
 */
export const toTypedValue: ContextValueParser = (
  value,
  target,
  member,
  meta,
) => {
  if (value === null || value === undefined) return value;
  const types = Reflect.getMetadata("design:paramtypes", target, member);
  const Parser = types[meta.index];
  if ([String, Number, Boolean].some((it) => it === Parser))
    return Parser(value);
  return isFunction(Parser) ? new Parser(value) : value;
};

/**
 * 请求对象
 * @alias Request
 */
export const Req = () => Ctx("request");

/**
 * @alias Req
 */
export const Request = Req;

/**
 * 响应对象
 * @alias Response
 */
export const Res = () => Ctx("response");

/**
 * @alias Res
 */
export const Response = Res;

/**
 * Cookie 信息
 */
export const Cookie = (name?: string) =>
  Ctx("cookies", (value) => {
    const cookies = value as HttpCookies;
    return name && cookies ? cookies.get(name) : cookies;
  });

/**
 * 路由参数
 * @param name 路由参数名
 */
export const Param = (name?: string, parse?: ContextValueParser) =>
  name ? Ctx(`params.${name}`, parse || toTypedValue) : Ctx("params");

/**
 * 获取查询参数
 * @param name 查询参数名
 */
export const Query = (name?: string, parse?: ContextValueParser) =>
  name ? Ctx(`query.${name}`, parse || toTypedValue) : Ctx("query");

/**
 * 获取请求头参数
 * @param name 查询参数名
 */
export const Header = (name?: string) =>
  name ? Ctx(`headers.${name}`) : Ctx("headers");
