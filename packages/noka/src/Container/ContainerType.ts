/** @format */

import { EntityInfo } from "./EntityInfo";

export interface ContainerType {
  /**
   * 向容器中注册一个实体
   * @param name    注册名称
   * @param entity  实例信息
   */
  register(name: string | symbol, entity: EntityInfo): void;

  /**
   * 通过类型名称创建一个实例
   * @param name 已注册的类型名称
   */
  get<T>(name: string | symbol): T;

  /**
   * 在实例上应用注入
   * @param instance
   */
  inject(instance: any): void;
}