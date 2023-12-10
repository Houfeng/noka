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
  /** 监听端口 */
  port: number;

  /** 绑定的 hostname */
  hostname?: string;

  /** HTTPS 配置 */
  secure?: {
    /** 私钥文件路径 */
    key: string;

    /** 证书文件路径 */
    cert: string;

    /**
     * 是否开始 HTTP->HTTPS 重定向
     * true: 重定向来自 80 端口的 HTTP 请求
     * number: 重定向来自动指定端口的 HTTP 请求
     * false/undefined: 不启用
     */
    redirect?: boolean | number;

    /**
     * 是否观察证书及私钥文件的变更
     * true: 启用观察，在证书文件变更时，自动重新加载证书
     * string: 指定的文件或目录路径发生变更时，自动重新加载证书
     * false/undefined: 不启用
     */
    watch?: boolean | string;
  };

  /**
   * 配置导入的自定议 loaders
   */
  loader_imports?: Record<string, string>;

  /**
   * 指定 loader 的选项配置
   */
  loader_options?: Record<string, false | JSONObject>;

  /** 其他配置 */
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
