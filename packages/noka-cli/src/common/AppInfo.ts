import { resolve } from "path";
import { BIN_DIR_NAME, SRC_DIR_NAME, ENTRY_FILE_NAME } from "noka-util";
import { iife, resolvePackageRoot } from "noka-util";
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

  readonly rootDir = iife(() => {
    const cwd = process.cwd();
    const { $1 } = this.options;
    const startPath = $1 ? resolve(cwd, $1) : cwd;
    return resolvePackageRoot(startPath);
  });

  readonly binDir = resolve(this.rootDir, `./${BIN_DIR_NAME}`);
  readonly srcDir = resolve(this.rootDir, `./${SRC_DIR_NAME}`);
  readonly binEntry = resolve(this.binDir, `./${ENTRY_FILE_NAME}.js`);
  readonly srcEntry = resolve(this.srcDir, `./${ENTRY_FILE_NAME}.ts`);

  readonly existCompileConf = iife(() => {
    return existsSync(resolve(this.rootDir, "./tsconfig.json"));
  });

  readonly packageConf = iife(() => {
    const file = resolve(this.rootDir, "./package.json");
    if (existsSync(file)) return require(file);
  });

  readonly name = this.packageConf?.name || "";
}
