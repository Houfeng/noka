import { ParameterizedContext } from "../../Application/ApplicationTypes";
import { getByPath, writeText, mkdir } from "noka-utility";
import { getContextMeta } from "./ContextInjector";
import { getRouteMappingMetaItems, RouteMappingMeta } from "./RouteMapping";
import { normalize, resolve } from "path";
import { EventSource } from "./EventSource";
import { AbstractLoader } from "../../Loader/AbstractLoader";
import { LoaderOptions } from "../../Loader/LoaderOptions";
import { BeanConstructor } from "../../Container";
import { getFileMeta } from "src/Loader/FileMetadata";

export type DebugRouteInfo = Omit<RouteMappingMeta, "priority"> & {
  file: string;
  controller: string;
  priority: string;
};

const controllerMetaKey = Symbol("Controller");

/**
 * 控制器信息
 */
export type ControllerMetadata = {
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
export function getControllerMeta(target: any): ControllerMetadata {
  return Reflect.getMetadata(controllerMetaKey, target);
}

/**
 * Controller 加载器
 */
export class ControllerLoader extends AbstractLoader<
  LoaderOptions,
  BeanConstructor<any>
> {
  /**
   * 预处理请求方法
   * @param verb 请求动作（HTTP Method）
   */
  protected normalizeHTTPMethods(verb: string | string[]) {
    return Array.isArray(verb) ? verb : [verb];
  }

  protected debugRouteItems: DebugRouteInfo[] = [];

  protected get debugDir() {
    return this.app.resolvePath("./debug");
  }

  protected appendDebugRouteItems(info: DebugRouteInfo) {
    if (!this.app.isLaunchSourceCode) return;
    this.debugRouteItems.push(info);
  }

  protected async dumpDebugRouteItemsToFile() {
    if (!this.app.isLaunchSourceCode || this.debugRouteItems.length < 1) return;
    await mkdir(this.debugDir);
    const dumpFile = resolve(this.debugDir, "./controllers.json");
    return writeText(
      dumpFile,
      JSON.stringify(this.debugRouteItems, null, "  "),
    );
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
   * 注册一个常规路由映射
   * @param app 应用实例
   * @param Controller 控制器类
   * @param controllerMeta 控制器信息
   * @param routeMapping 映射信息
   */
  protected registerRoute(
    Controller: BeanConstructor<any>,
    controllerMeta: ControllerMetadata,
    routeMapping: RouteMappingMeta,
    writeHandler?: (ctx: ParameterizedContext<any, {}>, result: any) => void,
  ) {
    const { verb, path, priority, method } = routeMapping;
    const httpMethods = this.normalizeHTTPMethods(verb);
    const routePath = normalize(`/${controllerMeta.path}/${path}`);
    const routeHandler = async (ctx: ParameterizedContext<any, {}>) => {
      const controllerInstance = new Controller();
      this.app.container.inject(controllerInstance);
      const result = await this.invokeControllerMethod(
        ctx,
        controllerInstance,
        method,
      );
      ctx.preventCache = true;
      if (writeHandler) return writeHandler(ctx, result);
      ctx.body = result;
    };
    this.app.router.register(routePath, httpMethods, routeHandler);
    this.appendDebugRouteItems({
      verb,
      path: routePath,
      priority: `${controllerMeta.priority}.${priority}`,
      file: getFileMeta(Controller)?.path?.replace(this.app.rootDir, ""),
      controller: Controller.name,
      method,
    });
  }

  /**
   * 注册一个 SSE 路由映射
   * @param app 应用实例
   * @param Controller 控制器类
   * @param controllerMeta 控制器信息
   * @param routeMapping 映射信息
   */
  protected registerSSERoute(
    Controller: BeanConstructor<any>,
    controllerMeta: ControllerMetadata,
    routeMapping: RouteMappingMeta,
  ) {
    const handler = (
      ctx: ParameterizedContext<any, {}>,
      source: EventSource<any>,
    ) => {
      if (!(source instanceof EventSource)) {
        const message = "The SSE method must return an EventSource";
        const { name: controllerName } = Controller;
        const { method } = routeMapping;
        throw new Error(`${message}: ${controllerName}.${method}`);
      }
      return source.accept(ctx.req, ctx.res);
    };
    this.registerRoute(Controller, controllerMeta, routeMapping, handler);
  }

  /**
   * 注册 Controller
   * @param app 应用实例
   * @param Controller 控制器类
   */
  protected registerController(Controller: BeanConstructor<any>) {
    const controllerMeta = getControllerMeta(Controller);
    const routeMetaItems = getRouteMappingMetaItems(Controller);
    if (!controllerMeta || !routeMetaItems || routeMetaItems.length < 1) return;
    routeMetaItems.sort((a, b) => b.priority - a.priority);
    routeMetaItems.forEach((routeMapping: RouteMappingMeta) => {
      if (routeMapping.ability === "SSE") {
        this.registerSSERoute(Controller, controllerMeta, routeMapping);
      } else {
        this.registerRoute(Controller, controllerMeta, routeMapping);
      }
    });
  }

  /**
   * 加载所有 Controller
   */
  public async load() {
    await super.load();
    const controllers = this.items.slice(0);
    controllers.sort(
      (a, b) => getControllerMeta(b).priority - getControllerMeta(a).priority,
    );
    controllers.forEach((Controller) => {
      this.registerController(Controller);
    });
    await this.dumpDebugRouteItemsToFile();
    this.app.logger?.info("Controller ready");
  }
}
