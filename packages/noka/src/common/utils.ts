/** @format */

import mkdirp from "mkdirp";
import { existsSync, readFile, writeFile } from "fs";
import { normalize } from "path";

const utils = require("ntils");

/**
 * 框架的 pkg 对象
 */
export const pkg = require("../../package.json");

/**
 * 通过路径从对象上获取值
 */
export function getByPath(obj: any, path: string) {
  return utils.getByPath(obj, path);
}

/**
 * 生成一个 UUID
 */
export function uuid(): string {
  return utils.newGuid();
}

/**
 * 合并两个对象
 * @param dst 目标对象
 * @param src 来源对象
 * @param ignoreKeys 忽略列表
 */
export function mix(dst: any, src: any, ignoreKeys?: string[]) {
  return utils.mix(dst, src, ignoreKeys);
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
 * 创建目录
 * @param dir 目录路径
 */
export function mkdir(dir: string) {
  return new Promise<string>((resolve, reject) => {
    mkdirp(dir, (err) => (err ? reject(err) : resolve(dir)));
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
 * 立即执行一个函数
 * @param fn 将执行的函数
 * @returns
 */
export function iife<T>(fn: () => T): T {
  return fn();
}
