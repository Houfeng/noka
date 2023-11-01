import { ParameterizedContext } from "koa";
import { getByPath, writeText, mkdir } from "noka-utility";
import { getContextMeta } from "./ContextInjector";
import { getRouteMappingItems, RouteMappingInfo } from "./RouteMapping";
import { IoCLoader } from "../IoCLoader";
import { normalize, resolve } from "path";

export type DebugRouteInfo = {
  verb: string | string[];
  path: string;
  file: string;
  controller: string;
  method: string;
}


const metadataKey = Symbol('Controller');

/**
 * 控制器信息
 */
export type ControllerMetadata = {
  path: string;
}

/**
 * 控制器注解，可用来声明一个 Controller 类
 * @param path 请求路径，可少略，默认为 `/`
 */
export function Controller(path = "/") {
  return (target: any) => {
    Reflect.metadata(metadataKey, { path })(target);
  };
}

/**
 * 获取控制器信息
 * @param target 对应的 controller 类
 */
export function getControllerMeta(target: any): ControllerMetadata {
  return Reflect.getMetadata(metadataKey, target);
}


/**
 * Controller 加载器
 */
export class ControllerLoader extends IoCLoader {
  /**
   * 获取请求方法
   * @param verb 请求动作（HTTP Method）
   */
  protected getHttpMethods(verb: string | string[]) {
    return Array.isArray(verb) ? verb : [verb];
  }

  protected debugRouteItems: DebugRouteInfo[] = [];

  protected get debugDir() {
    return this.app.resolvePath('./debug');
  }

  protected appendDebugRouteItems(info: DebugRouteInfo) {
    if (!this.app.isLaunchSourceCode) return;
    this.debugRouteItems.push(info);
  }

  protected async dumpDebugRouteItemsToFile() {
    if (!this.app.isLaunchSourceCode || this.debugRouteItems.length < 1) return;
    await mkdir(this.debugDir);
    const dumpFile = resolve(this.debugDir, "./controllers.json");
    return writeText(dumpFile, JSON.stringify(this.debugRouteItems, null, "  "));
  }

  /**
   * 注册一个路由映射
   * @param app 应用实例
   * @param controller 控制器类
   * @param controllerMeta 控制器信息
   * @param routeMapping 映射信息
   */
  protected registerRoute(
    controller: any,
    controllerMeta: ControllerMetadata,
    routeMapping: RouteMappingInfo,
  ) {
    const { path, verb, method } = routeMapping;
    const httpMethods = this.getHttpMethods(verb);
    const routePath = normalize(`/${controllerMeta.path}/${path}`);
    const routeHandler = async (
      ctx: ParameterizedContext<any, {}>,
      next: Function
    ) => {
      const controllerInstance = new controller();
      this.app.container.inject(controllerInstance);
      ctx.body = await this.invokeControllerMethod(
        ctx, controllerInstance, method
      );
      ctx.preventCache = true;
      await next();
    };
    this.app.router.register(routePath, httpMethods, routeHandler);
    this.appendDebugRouteItems({
      verb,
      path: routePath,
      file: controller.__file__?.replace(this.app.rootDir, ''),
      controller: controller.name,
      method,
    });
  }

  /**
   * 执行控制器方法
   * @param context 请求上下文
   * @param controllerInstance 控制器实例
   * @param method 控制器方法
   */
  protected async invokeControllerMethod(
    context: ParameterizedContext<any, {}>,
    controllerInstance: any,
    method: string,
  ) {
    const parameters = getContextMeta(controllerInstance, method)
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map((info) => getByPath(context, info.name));
    return controllerInstance[method](...parameters);
  }

  /**
   * 注册 Controller
   * @param app 应用实例
   * @param controller 控制器类
   */
  protected registerController(controller: unknown) {
    const controllerMeta = getControllerMeta(controller);
    const mappingItems = getRouteMappingItems(controller);
    if (!controllerMeta || !mappingItems || mappingItems.length < 1) return;
    mappingItems
      .sort((a, b) => b.priority - a.priority)
      .forEach((routeMapping: RouteMappingInfo) => {
        this.registerRoute(controller, controllerMeta, routeMapping);
      });
  }

  /**
   * 加载所有 Controller
   */
  public async load() {
    await super.load();
    this.content.forEach((controller) => {
      this.registerController(controller)
    });
    await this.dumpDebugRouteItemsToFile();
    this.app.logger?.info("Controller ready");
  }
}
