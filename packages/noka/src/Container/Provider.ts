import { BeanConstructor } from "./BeanInfo";

export type ProviderOptions = {
  singleton?: boolean;
  static?: boolean;
};

export type ProviderMetadata = {
  name: string | symbol;
  options: ProviderOptions;
};

const providerMetaKey = Symbol("Provider");

/**
 * 为一个类型声明向容器注册的信息，以备从 metadata 中读取并注册到 Ioc 容器中
 * @param name 名称
 */
export function Provider(name?: string | symbol, options?: ProviderOptions) {
  return (target: BeanConstructor<any>) => {
    name = name || target.name;
    Reflect.metadata(providerMetaKey, { name, options })(target);
  };
}

/**
 * 获取一个类型的 provider 元信息
 * @param target 类型
 */
export function getProviderMetadata(target: object): ProviderMetadata {
  return Reflect.getMetadata(providerMetaKey, target);
}
