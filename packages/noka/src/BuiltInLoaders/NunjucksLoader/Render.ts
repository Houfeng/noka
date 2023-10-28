import { getByPath } from "../../common/utils";
import { Inject, InjectGetterOptions } from "../../Container";
import { isFunction } from "ntils";
import { VIEWS_ENTITY_KEY } from "./constants";

/**
 * 视图注入 Getter 函数
 * @param options 注入选项
 */
export function renderInjectGetter(options: InjectGetterOptions) {
  const { container, info, originValue, instance } = options;
  const views = container.get(VIEWS_ENTITY_KEY);
  const render = getByPath(views, String(info.name));
  return !originValue || !isFunction(originValue)
    ? render
    : async (...args: any[]) =>
        render(await originValue.call(instance, ...args));
}

/**
 * 或 controller 注入渲染器
 * @param path 配置项的 JSON Path
 */
export function Render(path: string) {
  return Inject(path, { getter: renderInjectGetter });
}
