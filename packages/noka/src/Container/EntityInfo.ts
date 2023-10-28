/** @format */

export type EntityConstructor<T> = { new (): T };
export type EntityFactory<T> = () => T;

type ClassEntityInfo<T> = {
  type: "class";
  value: EntityConstructor<T>;
  cacheable?: boolean;
  cached?: T;
};

type ValueEntityInfo<T> = {
  type: "value";
  value: T;
  injected?: boolean;
};

type FactoryEntityInfo<T> = {
  type: "factory";
  value: EntityFactory<T>;
  cacheable?: boolean;
  cached?: T;
};

export type EntityInfo<T = any> =
  | ClassEntityInfo<T>
  | ValueEntityInfo<T>
  | FactoryEntityInfo<T>;

export function isClassEntity<T>(
  entity: EntityInfo<T>,
): entity is ClassEntityInfo<T> {
  return entity?.type === "class";
}

export function isValueEntity<T>(
  entity: EntityInfo<T>,
): entity is ValueEntityInfo<T> {
  return entity?.type === "value";
}

export function isFactoryEntity<T>(
  entity: EntityInfo<T>,
): entity is FactoryEntityInfo<T> {
  return entity?.type === "factory";
}
