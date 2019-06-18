import { EOL } from "os";
import { exec } from "../common/exec";
import { initTemplate } from "../common/module";
import { logger } from "../common/logger";
import { prompt } from "inquirer";
import { readDir } from "../common/readdir";
import { resolve } from "path";
import { writeFileSync } from "fs";

export async function init(template: string) {
  // 检查非空
  const files = await readDir(process.cwd());
  if (files && files.length > 0) throw new Error("当前目录为非空目录");
  // 下载模板
  logger.info("初始化工程...");
  template = template || "default";
  const pkgName = `noka-template-${template}`;
  await initTemplate(pkgName, process.cwd());
  // 更新信息
  const pkgFile = resolve(process.cwd(), "./package.json");
  const pkg = require(pkgFile);
  const answers = await prompt([
    {
      type: "input",
      message: "请输入名称:",
      name: "name",
      default: pkg.name,
      validate: value => !!value
    },
    {
      type: "input",
      message: "请输入版本:",
      name: "version",
      default: pkg.version,
      validate: value => !!value
    }
  ]);
  Object.assign(pkg, answers);
  writeFileSync(pkgFile, JSON.stringify(pkg, null, "") + EOL);
  // 安装依赖
  logger.info("安装依赖...");
  await exec("npm i");
  logger.info("初始化完成");
}
