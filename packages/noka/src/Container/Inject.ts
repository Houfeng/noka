/** @format */

import { ContainerType } from "./ContainerType";

const metadataKey = Symbol("inject");

/**
 * 注入选项
 */
export type InjectOptions = {
  handle?: (
    container: ContainerType,
    meta: InjectPropMetadata,
    instance: unknown,
    originValue: unknown,
  ) => unknown;
  extra?: unknown;
};

/**
 * 注入信息
 */
export type InjectPropMetadata = {
  name?: string | symbol;
  member: string | symbol;
  options?: InjectOptions;
};

/**
 * 注入一个类成员，通过名称在容器中查找类型并实例化后注入
 * @param name 名称
 */
export function Inject(name?: string | symbol, options?: InjectOptions) {
  return (target: any, member: string | symbol) => {
    const metadata: InjectPropMetadata = { name, member, options };
    const metadataList: InjectPropMetadata[] =
      Reflect.getMetadata(metadataKey, target) || [];
    metadataList.push(metadata);
    Reflect.metadata(metadataKey, metadataList)(target);
  };
}

/**
 * 获取属性注入信息
 * @param target 类型
 */
export function getInjectMetadata(target: any): InjectPropMetadata[] {
  return Reflect.getMetadata(metadataKey, target) || [];
}

/**
 * 获取在源码（TypeScript）中声明的类型
 * @param target 目标实例
 * @param member 成员名称
 * @returns
 */
export function getDesignType(target: any, member: string | symbol) {
  return Reflect.getMetadata("design:type", target, member);
}
