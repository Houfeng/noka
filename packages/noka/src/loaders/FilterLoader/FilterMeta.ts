import { BeanConstructor } from "../../Container";

const filterMetaKey = Symbol("Filter");

export type FilterMeta = {
  path: string;
  priority: number;
};

export function Filter(path = "/", priority = 0) {
  return (target: BeanConstructor<any>) => {
    Reflect.metadata(filterMetaKey, { path, priority })(target);
  };
}

export function getFilterMeta(target: object): FilterMeta {
  return Reflect.getMetadata(target, filterMetaKey);
}
