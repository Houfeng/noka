import { existsSync, readFile, writeFile } from "fs";
import { dirname, normalize } from "path";
import { isArray, isFunction, isObject, newGuid } from "ntils";
import { mkdirp as _mkdirp } from "mkdirp";
import _del from "del";

export * from "ntils";

/**
 * 生成一个 UUID
 */
export function uuid(): string {
  return newGuid();
}

/**
 * 读取文本文件
 * @param filename 文件路径
 */
export function readText(filename: string) {
  return new Promise<string>((resolve, reject) => {
    readFile(filename, "utf8", (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
}

/**
 * 写入文本文件
 * @param filename 文件路径
 */
export function writeText(filename: string, text: string) {
  return new Promise<void>((resolve, reject) => {
    writeFile(filename, text, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

/**
 * 获取一个可用端口
 */
export function acquirePort() {
  const oneport = require("oneport");
  return new Promise<number>((resolve, reject) =>
    oneport.acquire((err: Error, port: number) =>
      err ? reject(err) : resolve(port),
    ),
  );
}

/**
 * 创建一个目录
 * @param path  路径
 * @returns
 */
export function mkdirp(path: string) {
  return _mkdirp(path);
}

/**
 * 删除匹配的文件或目录
 * @param patterns 路径匹配模式
 * @param options 选项
 * @returns
 */
export function del(
  patterns: string | readonly string[],
  options?: _del.Options | undefined,
) {
  return _del(patterns, options);
}

/**
 * 字符串是不是一个路戏
 * @param str 字符串
 */
export function isPath(str: string) {
  if (!str) return false;
  return str.startsWith("/") || str.startsWith(".") || /^[a-z]+:/i.test(str);
}

/**
 * 是否是系统根目录
 * @param dir 目录
 */
export function isSystemRootDir(dir: string) {
  return !dir || dir === "/" || dir.endsWith(":\\") || dir.endsWith(":\\\\");
}

/**
 * 目录中存在 package.json
 * @param dir 目录
 */
export function isNodePackageDir(dir: string) {
  return existsSync(normalize(`${dir}/package.json`));
}

/**
 * 通过包内路径解析出来所在的包根目录
 * @param path 包内路径
 * @returns
 */
export function resolvePackageRoot(path: string) {
  let root = path;
  while (!isSystemRootDir(root) && !isNodePackageDir(root)) {
    root = dirname(root);
  }
  if (isSystemRootDir(root) || root === ".") root = process.cwd();
  return root;
}

/**
 * 立即执行一个函数
 * @param fn 将执行的函数
 * @returns
 */
export function iife<T>(fn: () => T): T {
  return fn();
}

/**
 * 检查一个对象是否是一个普通 Record<string, unknown> 对象
 * @param value
 * @returns
 */
function isRecordObject(value: any): value is Record<string, unknown> {
  return isObject(value) && !isArray(value) && !isFunction(value);
}

/**
 * 合并两个对象，obj2 将覆盖 obj1，并产生一个新的 obj3
 * @param obj1 原始对象1
 * @param obj2 原始对象2
 */
export function merge<T1 extends object, T2 extends object>(
  obj1: T1,
  obj2: T2,
): T1 & T2 {
  const obj3: any = { ...obj1 };
  Object.entries(obj2).forEach(([key, value]) => {
    const isRecursion = isRecordObject(value) && isRecordObject(obj3[key]);
    obj3[key] = isRecursion ? merge(obj3[key], value) : value;
  });
  return obj3;
}
