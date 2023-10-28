
export const metadataKey = Symbol("Context");


/**
 * 请求上下文注入映射信息
 */
export type ContextMappingMeta = {
  type: string;
  name: string;
  index: number;
}

/**
 * 从 ctx 上获取内容
 * @param name JSON Path
 */
export function Context(name = ".") {
  return (target: any, member: string, index: number) => {
    const type = "ctx";
    const list = getContextMeta(target, member);
    list.push({ type, name, index });
    Reflect.metadata(metadataKey, list)(target, member);
  };
}
export const Ctx = Context;

/**
 * 请求对象
 */
export const Request = () => Context("request");
export const Req = Request;

/**
 * 响应对象
 */
export const Response = () => Context("response");
export const Res = Response;

/**
 * Cookie 信息
 */
export const Cookie = () => Context("cookies");

/**
 * 路由参数
 * @param name 路由参数名
 */
export const Param = (name?: string) =>
  name ? Context(`params.${name}`) : Context("params");

/**
 * 获取请求主体
 * @param name 请求主体参数
 */
export const Body = (name?: string) =>
  name ? Context(`request.body.${name}`) : Context("request.body");

/**
 * 获取查询参数
 * @param name 查询参数名
 */
export const Query = (name?: string) =>
  name ? Context(`query.${name}`) : Context("query");

/**
 * 获取请求头参数
 * @param name 查询参数名
 */
export const Header = (name?: string) =>
  name ? Context(`headers.${name}`) : Context("headers");

/**
 * 获取控制器方法的参数注入信息
 * @param target 控制器
 * @param member 控制器方法名
 */
export function getContextMeta(target: any, member: string) {
  const list = Reflect.getMetadata(metadataKey, target, member) || [];
  return list as ContextMappingMeta[];
}
