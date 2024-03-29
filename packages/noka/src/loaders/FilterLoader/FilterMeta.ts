import { BeanConstructor } from "../../Container";

const filterMetaKey = Symbol("Filter");

export type FilterMeta = {
  path: string | RegExp | string[] | RegExp[];
  priority: number;
};

export function Filter(
  path: string | RegExp | string[] | RegExp[] = "/*",
  priority = 0,
) {
  return (target: BeanConstructor) => {
    Reflect.metadata(filterMetaKey, { path, priority })(target);
  };
}

export function getFilterMeta(target: object): FilterMeta {
  return Reflect.getMetadata(filterMetaKey, target);
}
