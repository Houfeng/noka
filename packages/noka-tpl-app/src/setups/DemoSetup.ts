import { ApplicationLike, Setup } from "noka";

/**
 * 应用启动时, setup 函数将触发执行
 * 执行结果可被 controller/service 等模块注入
 * 在容器中的名称优选级为 fn.setupName > fn.displayName > fn.name
 */
@Setup("demo")
export class Demo {
  handle(app: ApplicationLike) {
    return `Current app root: ${app.rootDir}`;
  }
}
