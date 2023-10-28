import { Provider, ProviderOptions } from "../IOCContainer";

/**
 * 模型选项
 */
export type ModelOptions = ProviderOptions;

/**
 * 模型注解
 * @param name 模型名称（用于 inject）
 * @param options 选项
 */
export function Model(name: string | symbol, options?: ModelOptions) {
  return Provider(name, { ...options, static: true });
}
