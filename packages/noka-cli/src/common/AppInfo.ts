/** @format */

import { normalize, resolve } from "path";
import { iife, resolvePackageRoot } from "noka-utility";
import { existsSync } from "fs";

/**
 * 应用信息构造选项
 */
export type AppInfoOptions = {
  // 当前环境名称
  env?: string;
  // 启动点（入口文件或应用目录）
  $1?: string;
};

/**
 * 当前应用信息
 */
export class AppInfo {
  constructor(private options: AppInfoOptions) {}

  readonly root = iife(() => {
    const cwd = process.cwd();
    const { $1 } = this.options;
    const startPath = $1 ? resolve(cwd, $1) : cwd;
    return resolvePackageRoot(startPath);
  });

  readonly binDir = resolve(this.root, normalize("./dist"));
  readonly srcDir = resolve(this.root, normalize("./src"));
  readonly binEntry = resolve(this.binDir, normalize("./app.js"));
  readonly srcEntry = resolve(this.srcDir, normalize("./app.ts"));

  readonly existCompileConf = iife(() => {
    return existsSync(resolve(this.root, "./tsconfig.json"));
  });

  readonly packageConf = iife(() => {
    const file = resolve(this.root, "./package.json");
    if (existsSync(file)) return require(file);
  });

  readonly appConf = iife(() => {
    const { NOKA_ENV, NODE_ENV } = process.env;
    const env = this.options.env || NOKA_ENV || NODE_ENV;
    const { Parser } = require("confman/index");
    const parser = new Parser({ env });
    const file = resolve(this.root, "./configs/config");
    return parser.load(file);
  });

  readonly name = this.appConf.name || this.packageConf.name;
}
