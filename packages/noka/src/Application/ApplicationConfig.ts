import { type JSONObject, type JSONValue } from "noka-utility";
import { getByPath } from "noka-utility";
import { type ContainerLike, Inject, InjectMeta } from "../Container";
import { ApplicationSymbol } from "./ApplicationSymbol";

/**
 * 面向 config.yml 的类型声明
 *
 * 用 yaml 而不用于 js/ts 作为配置的原因有二：
 *  1. 避免在配置中写逻辑
 *  2. 基于第一点先 yaml 而不是 json 的原因是，yaml 写易手写和阅读
 *
 * 因为 yaml 并没有类型检查，为避免不小心的大小写错误，配置 key 采用全小写下划线分隔
 */
export type ApplicationConfig = {
  port?: number;
  hostname?: string;
  secure?: { key: string; cert: string; watch?: boolean | string };
  loader_imports?: Record<string, string>;
  loader_options?: Record<string, false | JSONObject>;
  [key: string]: JSONValue;
};

/**
 * 配置注入处理函数
 * @param options 注入选项
 */
function configInjectHandler(container: ContainerLike, meta: InjectMeta) {
  const config = container.get(ApplicationSymbol.Config);
  return getByPath(config, String(meta.name));
}

/**
 * 向 service 或 controller 注入配置
 * @param path 配置项的 JSON Path
 */
export function Config(path: string) {
  return Inject(path, { handle: configInjectHandler });
}
