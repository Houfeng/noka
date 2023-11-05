import { BeanConstructor } from "./BeanInfo";

const providerMetaKey = Symbol("Provider");

export type ProviderOptions = {
  singleton?: boolean;
  static?: boolean;
};

export type ProviderMeta = {
  name: string | symbol;
  options: ProviderOptions;
};

/**
 * 为一个类型声明向容器注册的信息，以备从 metadata 中读取并注册到 Ioc 容器中
 * @param name 名称
 */
export function Provider(name?: string | symbol, options?: ProviderOptions) {
  return (target: BeanConstructor) => {
    name = name || target.name;
    Reflect.metadata(providerMetaKey, { name, options })(target);
  };
}

/**
 * 获取一个类型的 provider 元信息
 * @param target 类型
 */
export function getProviderMeta(target: object): ProviderMeta {
  return Reflect.getMetadata(providerMetaKey, target);
}
