import { JSONObject, JSONValue } from "noka-utility";

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
  secure?: { key: string; cert: string };
  loader_imports?: Record<string, string>;
  loader_options?: Record<string, false | JSONObject>;
  [key: string]: JSONValue;
};

export const ApplicationConfigRegisterKey = Symbol("Config");
export const ApplicationLoggerRegisterKey = Symbol("Logger");
