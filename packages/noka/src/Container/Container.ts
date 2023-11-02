/** @format */

import { getInjectMetadata, InjectPropMetadata } from "./Inject";
import { ContainerType } from "./ContainerType";
import {
  EntityInfo,
  isClassEntity,
  isFactoryEntity,
  isValueEntity,
} from "./EntityInfo";

/**
 * IoC 容器类
 */
export class Container implements ContainerType {
  /**
   * 所有已注册的实体信息
   */
  protected readonly entities = new Map<string | symbol, EntityInfo>();

  /**
   * 向容器中注册一个实体
   * @param name    注册名称
   * @param entity  实例信息
   */
  register<T extends EntityInfo = EntityInfo>(
    name: string | symbol,
    entity: T,
  ) {
    if (this.entities.has(name)) {
      throw new Error(`IoC entity name is duplicated: ${String(name)}`);
    }
    this.entities.set(name, entity);
  }

  /**
   * 在实例上注入一个属性
   * @param instance 将要执行注入的实例
   * @param meta 注入信息
   */
  private injectProp(instance: any, meta: InjectPropMetadata) {
    const cacheKey = Symbol(String(meta.member));
    const originValue = instance[meta.member];
    delete instance[meta.member];
    Object.defineProperty(instance, meta.member, {
      enumerable: true,
      get: () => {
        if (cacheKey in instance) return instance[cacheKey];
        instance[cacheKey] = meta.options?.handle
          ? meta.options.handle(this, meta, instance, originValue)
          : this.get(meta.name);
        return instance[cacheKey];
      },
    });
  }

  /**
   * 在实例上应用注入
   * @param instance
   */
  public inject(instance: unknown) {
    const metadataList = getInjectMetadata(instance);
    metadataList.forEach((meta: InjectPropMetadata) =>
      this.injectProp(instance, meta),
    );
  }

  /**
   * 通过类型名称创建一个实例
   * @param name 已注册的类型名称
   */
  public get<T = unknown>(name: string | symbol, ignoreNotFoundError = false) {
    if (!name) throw new Error("Invalid entity name");
    const entity: EntityInfo<T> | undefined = this.entities.get(name);
    // 0. 不存在的 name，返回 undefined
    if (!entity && !ignoreNotFoundError) {
      throw new Error(`Entity not found: ${String(name)}`);
    }
    if (!entity) return;
    // 1. 如果注册为值直接返回 value
    if (isValueEntity(entity)) {
      if (!entity.injected) this.inject(entity.value);
      entity.injected = true;
      return entity.value;
    }
    // 2.1. 如果注册为工厂函数，且启用了缓存，将执行结果缓存并返回，再次获取直接返回缓存
    if (isFactoryEntity(entity) && entity.cacheable) {
      if (entity.cached) return entity.cached;
      entity.cached = entity.value();
      this.inject(entity.cached);
      return entity.cached;
    }
    // 2.2. 如果注册为工厂函数，且未启用缓存，将执行结果直接返回
    if (isFactoryEntity(entity)) {
      const instance = entity.value();
      this.inject(instance);
      return instance;
    }
    // 3.1. 如果注册为类，且启用了缓存，将新实例缓存并返回，再次获取直接返回缓存实例
    if (isClassEntity(entity) && entity.cacheable) {
      if (entity.cached) return entity.cached;
      entity.cached = new entity.value();
      this.inject(entity.cached);
      return entity.cached;
    }
    // 3.2. 如果注册为工厂函数，且未启用缓存，直接返回新实例
    if (isClassEntity(entity)) {
      const instance = new entity.value();
      this.inject(instance);
      return instance;
    }
    throw new Error(`Cannot create entity: ${JSON.stringify(entity)}`);
  }
}
