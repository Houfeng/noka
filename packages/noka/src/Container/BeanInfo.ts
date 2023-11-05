export type BeanConstructor<T> = { new (): T };
export type BeanFactory<T> = () => T;

type ClassBeanInfo<T> = {
  type: "class";
  value: BeanConstructor<T>;
  cacheable?: boolean;
  cached?: T;
};

type ValueBeanInfo<T> = {
  type: "value";
  value: T;
  injected?: boolean;
};

type FactoryBeanInfo<T> = {
  type: "factory";
  value: BeanFactory<T>;
  cacheable?: boolean;
  cached?: T;
};

export type BeanInfo<T = any> =
  | ClassBeanInfo<T>
  | ValueBeanInfo<T>
  | FactoryBeanInfo<T>;

export function isClassBean<T>(bean: BeanInfo<T>): bean is ClassBeanInfo<T> {
  return bean?.type === "class";
}

export function isValueBean<T>(bean: BeanInfo<T>): bean is ValueBeanInfo<T> {
  return bean?.type === "value";
}

export function isFactoryBean<T>(
  bean: BeanInfo<T>,
): bean is FactoryBeanInfo<T> {
  return bean?.type === "factory";
}
