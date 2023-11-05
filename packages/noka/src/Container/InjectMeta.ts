import { ContainerLike } from "./ContainerLike";

const injectMetaKey = Symbol("Inject");

/**
 * 注入选项
 */
export type InjectOptions = {
  handle?: (
    container: ContainerLike,
    meta: InjectMeta,
    instance: unknown,
    originValue: unknown,
  ) => unknown;
  extra?: unknown;
};

/**
 * 注入信息
 */
export type InjectMeta = {
  name?: string | symbol | Function;
  member: string | symbol;
  options?: InjectOptions;
};

/**
 * 注入一个类成员，通过名称在容器中查找类型并实例化后注入
 * @param name 名称
 */
export function Inject(
  name?: string | symbol | Function,
  options?: InjectOptions,
) {
  return (target: any, member: string | symbol) => {
    const metadata: InjectMeta = { name, member, options };
    const metadataList: InjectMeta[] =
      Reflect.getMetadata(injectMetaKey, target) || [];
    metadataList.push(metadata);
    Reflect.metadata(injectMetaKey, metadataList)(target);
  };
}

/**
 * 获取属性注入信息
 * @param target 类型
 */
export function getInjectMeta(target: object): InjectMeta[] {
  return Reflect.getMetadata(injectMetaKey, target) || [];
}

/**
 * 获取在源码（TypeScript）中声明的类型
 * @param target 目标实例
 * @param member 成员名称
 * @returns
 */
export function getDesignType(target: object, member: string | symbol) {
  return Reflect.getMetadata("design:type", target, member);
}
