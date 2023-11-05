import { ApplicationLike } from "noka";

/**
 * 应用启动时, setup 函数将触发执行
 * 执行结果可被 controller/service 等模块注入
 * 在容器中的名称优选级为 fn.setupName > fn.displayName > fn.name
 *
 * @param app 当前应用实例
 * @returns
 */
export function demo(app: ApplicationLike) {
  return `Current app root: ${app.rootDir}`;
}

// 声明注入名称
demo.setupName = "demo";
