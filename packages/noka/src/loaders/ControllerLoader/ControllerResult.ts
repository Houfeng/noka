import { isNumber } from "noka-utility";

const mark = Symbol("ControllerResult");

/** ControllerResultType */
export type ControllerResultType<T = unknown> = {
  [mark]: true;
  body: T;
  status: number;
};

/** Controller 方法处理结果 */
export function ControllerResult<T = unknown>(
  body: T,
  status?: number,
): ControllerResultType<T>;
export function ControllerResult<T = unknown>(
  status: number,
  body: T,
): ControllerResultType<T>;
export function ControllerResult<T = unknown>(
  body: T,
  status = 200,
): ControllerResultType<T> {
  if (isNumber(body) && !isNumber(status)) {
    return { [mark]: true, status: body, body: status };
  } else {
    return { [mark]: true, status, body };
  }
}

/** 是否是 ControllerResult */
export function isControllerResult<T = unknown>(
  value: any,
): value is ControllerResultType<T> {
  return value?.[mark] === true;
}
