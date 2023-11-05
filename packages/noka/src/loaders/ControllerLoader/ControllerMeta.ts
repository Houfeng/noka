const controllerMetaKey = Symbol("Controller");

/**
 * 控制器信息
 */
export type ControllerMeta = {
  path: string;
  priority: number;
};

/**
 * 控制器注解，可用来声明一个 Controller 类
 * @param path 请求路径，可少略，默认为 `/`
 */
export function Controller(path = "/", priority = 0) {
  return (target: any) => {
    Reflect.metadata(controllerMetaKey, { path, priority })(target);
  };
}

/**
 * 获取控制器信息
 * @param target 对应的 controller 类
 */
export function getControllerMeta(target: any): ControllerMeta {
  return Reflect.getMetadata(controllerMetaKey, target);
}
