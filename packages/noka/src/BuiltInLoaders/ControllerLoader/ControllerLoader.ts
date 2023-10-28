import { Context } from "koa";
import { getByPath, writeText, mkdir } from "../../common/utils";
import { getControllerInfo, IControllerInfo } from "./Controller";
import { getCtxInfos } from "./Context";
import { getMappingInfos, IMappingInfo } from "./Mapping";
import { IoCLoader } from "../IoCLoader";
import { normalize, resolve } from "path";
import { IRouteDumpInfo } from "./IRouteInfo";

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

  /**
   * dump 信息列表
   */
  protected dumpList: IRouteDumpInfo[] = [];

  /**
   * dump 运行时信息
   * @param info dump 信息
   */
  protected dump(info: IRouteDumpInfo) {
    if (!this.isDevelopment) return;
    this.dumpList.push(info);
  }

  /**
   * 保存 dump 信息
   */
  protected async saveDump() {
    if (!this.isDevelopment || this.dumpList.length < 1) return;
    await mkdir(this.tempDir);
    const dumpFile = resolve(this.tempDir, "./controllers.json");
    return writeText(dumpFile, JSON.stringify(this.dumpList, null, "  "));
  }

  /**
   * 注册一个路由映射
   * @param app 应用实例
   * @param ctlType 控制器类
   * @param ctlInfo 控制器信息
   * @param mapInfo 映射信息
   */
  protected regRoute(
    ctlType: any,
    ctlInfo: IControllerInfo,
    mapInfo: IMappingInfo,
  ) {
    const { path, verb, method } = mapInfo;
    const httpMethods = this.getHttpMethods(verb);
    const routePath = normalize(`/${ctlInfo.path}/${path}`);
    const routeHandler = async (ctx: any, next: Function) => {
      const ctlInstance = new ctlType();
      this.container.inject(ctlInstance);
      ctx.body = await this.invokeCtlMethod(ctx, ctlInstance, method);
      ctx.preventCahce = true;
      await next();
    };
    this.app.router.register(routePath, httpMethods, routeHandler);
    this.dump({
      verb,
      path: routePath,
      file: ctlType.file,
      controller: ctlType.name,
      method,
    });
  }

  /**
   * 执行控制器方法
   * @param ctx 请求上下文
   * @param ctlInstance 控制器实例
   * @param method 控制器方法
   */
  protected async invokeCtlMethod(
    ctx: Context,
    ctlInstance: any,
    method: string,
  ) {
    const parameters = getCtxInfos(ctlInstance, method)
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map((info) => getByPath(ctx, info.name));
    return ctlInstance[method](...parameters);
  }

  /**
   * 注册 Controller
   * @param app 应用实例
   * @param ctlType 控制器类
   */
  protected regCtlType(ctlType: any) {
    const ctlInfo = getControllerInfo(ctlType);
    const mapppingInfos = getMappingInfos(ctlType);
    if (!ctlInfo || !mapppingInfos || mapppingInfos.length < 1) return;
    mapppingInfos.forEach((mapInfo: IMappingInfo) => {
      this.regRoute(ctlType, ctlInfo, mapInfo);
    });
  }

  /**
   * 加载所有 Controller
   */
  public async load() {
    await super.load();
    this.content.forEach((ctlType: any) => this.regCtlType(ctlType));
    await this.saveDump();
    this.app.logger.info("Controller ready");
  }
}
