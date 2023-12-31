import { HttpContext, HttpResult } from "../../Application/ApplicationTypes";
import { getByPath, writeText, mkdirp, isNull } from "noka-util";
import { getContextMeta } from "./ContextMeta";
import { getRouteMetaItems, RouteMeta } from "./RouteMeta";
import { normalize, resolve } from "path";
import { EventSource } from "./EventSource";
import { AbstractLoader } from "../../Loader/AbstractLoader";
import { LoaderOptions } from "../../Loader/LoaderOptions";
import { BeanConstructor } from "../../Container";
import { getFileMeta } from "../../Loader/FileMetadata";
import { ControllerMeta, getControllerMeta } from "./ControllerMeta";

export type DebugRouteInfo = Omit<RouteMeta, "priority"> & {
  file: string;
  controller: string;
  priority: string;
};

/**
 * Controller 加载器
 */
export class ControllerLoader extends AbstractLoader<
  LoaderOptions,
  BeanConstructor
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
    if (!this.app.isSourceMode) return;
    this.debugRouteItems.push(info);
  }

  protected async dumpDebugRouteItemsToFile() {
    if (!this.app.isSourceMode || this.debugRouteItems.length < 1) return;
    await mkdirp(this.debugDir);
    const dumpFile = resolve(this.debugDir, "./controllers.json");
    return writeText(
      dumpFile,
      JSON.stringify(this.debugRouteItems, null, "  "),
    );
  }

  /**
   * 执行控制器方法
   * @param context 请求上下文
   * @param instance 控制器实例
   * @param method 控制器方法
   */
  protected async invokeControllerMethod(
    context: HttpContext,
    instance: any,
    method: string,
  ) {
    const parameters = getContextMeta(instance, method)
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map((meta) => {
        const value = getByPath(context, meta.name);
        return meta.parse ? meta.parse(value, instance, method, meta) : value;
      });
    return instance[method](...parameters, context);
  }

  /**
   * 合并路由路径
   */
  protected mergeRoutePath(prefix: string, path: string) {
    const mergedPath = normalize(`/${prefix}/${path}`);
    return mergedPath.length > 1 && mergedPath.at(-1) === "/"
      ? mergedPath.slice(0, -1)
      : mergedPath;
  }

  /**
   * 注册一个常规路由映射
   * @param app 应用实例
   * @param Controller 控制器类
   * @param controllerMeta 控制器信息
   * @param routeMeta 映射信息
   */
  protected registerRoute(
    Controller: BeanConstructor,
    controllerMeta: ControllerMeta,
    routeMeta: RouteMeta,
    writeHandler?: (ctx: HttpContext, result: any) => void,
  ) {
    const { verb, path, priority, method } = routeMeta;
    const httpMethods = this.normalizeHTTPMethods(verb);
    const routePath = this.mergeRoutePath(controllerMeta.path, path);
    const routeHandler = async (ctx: HttpContext) => {
      const controllerInstance = new Controller();
      this.app.container.inject(controllerInstance);
      const result = await this.invokeControllerMethod(
        ctx,
        controllerInstance,
        method,
      );
      ctx.preventCache = true;
      if (writeHandler) return writeHandler(ctx, result);
      if (HttpResult.is(result)) return result.writeTo(ctx.response);
      if (!isNull(result)) ctx.body = result;
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
   * @param routeMeta 映射信息
   */
  protected registerSSERoute(
    Controller: BeanConstructor,
    controllerMeta: ControllerMeta,
    routeMeta: RouteMeta,
  ) {
    const handler = (ctx: HttpContext, source: EventSource) => {
      if (!(source instanceof EventSource)) {
        const message = "The SSE method must return an EventSource";
        const { name: controllerName } = Controller;
        const { method } = routeMeta;
        throw new Error(`${message}: ${controllerName}.${method}`);
      }
      return source.accept(ctx.req, ctx.res);
    };
    this.registerRoute(Controller, controllerMeta, routeMeta, handler);
  }

  /**
   * 注册 Controller
   * @param app 应用实例
   * @param Controller 控制器类
   */
  protected registerController(
    Controller: BeanConstructor,
    controllerMeta: ControllerMeta,
  ) {
    const routeMetaItems = getRouteMetaItems(Controller);
    if (!controllerMeta || !routeMetaItems || routeMetaItems.length < 1) return;
    routeMetaItems.sort((a, b) => b.priority - a.priority);
    routeMetaItems.forEach((routeMapping: RouteMeta) => {
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
    (await this.loadModules())
      .map((Controller) => ({
        Controller,
        meta: getControllerMeta(Controller),
      }))
      .filter((it) => !!it.Controller && !!it.meta)
      .sort((a, b) => b.meta.priority - a.meta.priority)
      .forEach(({ Controller, meta }) => {
        this.registerController(Controller, meta);
      });
    await this.dumpDebugRouteItemsToFile();
    this.app.logger?.info("Controller ready");
  }
}
