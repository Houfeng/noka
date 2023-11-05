import { BeanConstructor } from "../../Container";

const setupMetaKey = Symbol("Filter");

export type SetupMeta = {
  name: string;
  priority: number;
};

export function Setup(name?: string, priority = 0) {
  return (target: BeanConstructor) => {
    name = name || target.name;
    Reflect.metadata(setupMetaKey, { name, priority })(target);
  };
}

export function getSetupMeta(target: object): SetupMeta {
  return Reflect.getMetadata(target, setupMetaKey);
}
