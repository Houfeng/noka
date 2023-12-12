export type ReadOnly<T> = {
  readonly [key in keyof T]: T[key];
};

export type DeepReadOnly<T> = {
  readonly [key in keyof T]: DeepReadOnly<T[key]>;
};

export function ReadOnlyObject<T extends object>(target: T): ReadOnly<T> {
  return target;
}

export function DeepReadOnlyObject<T extends object>(
  target: T,
): DeepReadOnly<T> {
  return target;
}

export type AnyClass = new (...args: any) => any;

export type ReadOnlyClass<T extends AnyClass> = new (
  ...args: ConstructorParameters<T>
) => ReadOnly<InstanceType<T>>;

export type DeepReadOnlyClass<T extends AnyClass> = new (
  ...args: ConstructorParameters<T>
) => DeepReadOnly<InstanceType<T>>;

export function ReadOnlyClass<T extends AnyClass>(target: T): ReadOnlyClass<T> {
  return ((...args: any) => new target(...args)) as any;
}

export function DeepReadOnlyClass<T extends AnyClass>(
  target: T,
): DeepReadOnlyClass<T> {
  return ((...args: any) => new target(...args)) as any;
}

export type Mutable<T> = {
  -readonly [key in keyof T]: T[key];
};

export function Mutable<T>(target: T): Mutable<T> {
  return target;
}

export type Primitive = bigint | boolean | null | number | string | undefined;

export interface JSONObject {
  [key: string]: JSONValue;
}
export type JSONValue = Primitive | JSONObject | JSONArray;
export type JSONArray = JSONValue[];

export type StringKeyOf<T> = Extract<keyof T, string>;

export type ValueOf<T> = T[keyof T];

export type Nullable<T> = T | null | undefined;

export type UnboxPromise<T extends Promise<any> | any> = T extends Promise<
  infer U
>
  ? U
  : T;

// export type NullableResult<T> = Nullable<T> | undefined;
// export type NullableParams<T> = Nullable<T> | undefined;
