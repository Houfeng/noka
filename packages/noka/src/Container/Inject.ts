import { IOCContainerInterface } from "./ContainerType";
import { IOC_PROP_INJECT } from "./constants";

/**
 * 注入选项
 */
export type InjectOptions = {
  getter?: InjectGetter;
  [key: string]: any;
};

/**
 * 注入信息
 */
export type InjectInfo = {
  name: string | symbol;
  member: string | symbol;
  options: InjectOptions;
};

/**
 * 用于获取注入值的 Getter 函数参数
 */
export type InjectGetterOptions = {
  container: IOCContainerInterface;
  info: InjectInfo;
  originValue: any;
  instance: any;
};

/**
 * 用于获取注入值的 Getter 函数
 */
export type InjectGetter = (options: InjectGetterOptions) => any;

/**
 * 默认的实体 Getter 函数
 * @param options 选项
 */
export function defaultInjectGetter(options: InjectGetterOptions) {
  const { container, info } = options;
  return container.get(info.name);
}

/**
 * 注入一个类成员，通过名称在容器中查找类型并实例化后注入
 * @param name 名称
 */
export function Inject(name?: string | symbol, options: InjectOptions = {}) {
  return (target: any, member: string | symbol) => {
    if (!name) name = member;
    const injectInfo: InjectInfo = { name, member, options };
    const injectList: InjectInfo[] =
      Reflect.getMetadata(IOC_PROP_INJECT, target) || [];
    injectList.push(injectInfo);
    Reflect.metadata(IOC_PROP_INJECT, injectList)(target);
  };
}

/**
 * 获取属性注入信息
 * @param target 类型
 */
export function getPropInjectInfos(target: any) {
  const list = Reflect.getMetadata(IOC_PROP_INJECT, target) || [];
  return list as InjectInfo[];
}
