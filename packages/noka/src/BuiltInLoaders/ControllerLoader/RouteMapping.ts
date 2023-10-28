
const metadataKey = Symbol("RouteMapping");


/**
 * 路由映射信息
 */
export type RouteMappingInfo = {
  verb: string | string[];
  path: string;
  method: string;
}

/**
 * 获取所有路由映射
 * @param target 类或原型
 */
export function getRouteMappingItems(target: any) {
  const list = Reflect.getMetadata(metadataKey, target) || [];
  return list as RouteMappingInfo[];
}

/**
 * 路由映射，声明允许的请求方法有路径
 * @param verb Http Method
 * @param path 请求路径
 */
export function RouteMapping(verb: string, path = "/") {
  return (target: any, method: string) => {
    const controller = target.constructor;
    const mappingItems = getRouteMappingItems(controller);
    mappingItems.push({ verb, path, method });
    Reflect.metadata(metadataKey, mappingItems)(controller);
  };
}

/**
 * 映射 GET 请求
 * @param path 请求路径
 */
export const Get = (path = "/") => RouteMapping("GET", path);

/**
 * 映射 POST 请求
 * @param path 请求路径
 */
export const Post = (path = "/") => RouteMapping("POST", path);

/**
 * 映射 PUT 请求
 * @param path 请求路径
 */
export const Put = (path = "/") => RouteMapping("PUT", path);

/**
 * 映射 DELETE 请求
 * @param path 请求路径
 */
export const Del = (path = "/") => RouteMapping("DELETE", path);

/**
 * 映射 OPTIONS 请求
 * @param path 请求路径
 */
export const Options = (path = "/") => RouteMapping("OPTIONS", path);

/**
 * 映射 PATCH 请求
 * @param path 请求路径
 */
export const Patch = (path = "/") => RouteMapping("PATCH", path);

/**
 * 映射 HEAD 请求
 * @param path 请求路径
 */
export const Head = (path = "/") => RouteMapping("HEAD", path);
