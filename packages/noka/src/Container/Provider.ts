/** @format */

export type ProviderOptions = {
  singleton?: boolean;
  static?: boolean;
};

export type ProviderMetadata = {
  name: string | symbol;
  options: ProviderOptions;
};

const metadataKey = Symbol("provider");

/**
 * 声明一个类，将其放入 IoC 容器内
 * @param name 名称
 */
export function Provider(name?: string | symbol, options?: ProviderOptions) {
  return (target: any) => {
    name = name || target.name;
    Reflect.metadata(metadataKey, { name, options })(target);
  };
}

/**
 * 获取一个类型的 provider 元信息
 * @param target 类型
 */
export function getProviderMetadata(target: object): ProviderMetadata {
  return Reflect.getMetadata(metadataKey, target);
}
