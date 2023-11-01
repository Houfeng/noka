const metadataKey = Symbol("RouteMapping");

/**
 * 路由映射信息
 */
export type RouteMappingInfo = {
  verb: string | string[];
  path: string;
  priority: number;
  method: string;
}

/**
 * 获取所有路由映射
 * @param target 类或原型
 */
export function getRouteMappingItems(target: any): RouteMappingInfo[] {
  return Reflect.getMetadata(metadataKey, target) || [];
}

/**
 * 路由映射，声明允许的请求方法有路径
 * @param verb Http Method
 * @param path 请求路径
 */
export function RouteMapping(verb: string, path = "/", priority = 0) {
  return (target: any, method: string) => {
    const controller = target.constructor;
    const mappingItems = getRouteMappingItems(controller);
    mappingItems.push({ verb, path, priority, method });
    Reflect.metadata(metadataKey, mappingItems)(controller);
  };
}

/**
 * 映射 GET 请求
 * @param path 请求路径
 */
export const Get = (path = "/", priority = 0) =>
  RouteMapping("GET", path, priority);

/**
 * 映射 POST 请求
 * @param path 请求路径
 */
export const Post = (path = "/", priority = 0) =>
  RouteMapping("POST", path, priority);

/**
 * 映射 PUT 请求
 * @param path 请求路径
 */
export const Put = (path = "/", priority = 0) =>
  RouteMapping("PUT", path, priority);

/**
 * 映射 DELETE 请求
 * @param path 请求路径
 */
export const Del = (path = "/", priority = 0) =>
  RouteMapping("DELETE", path, priority);

/**
 * 映射 OPTIONS 请求
 * @param path 请求路径
 */
export const Options = (path = "/", priority = 0) =>
  RouteMapping("OPTIONS", path, priority);

/**
 * 映射 PATCH 请求
 * @param path 请求路径
 */
export const Patch = (path = "/", priority = 0) =>
  RouteMapping("PATCH", path, priority);

/**
 * 映射 HEAD 请求
 * @param path 请求路径
 */
export const Head = (path = "/", priority = 0) =>
  RouteMapping("HEAD", path, priority);
