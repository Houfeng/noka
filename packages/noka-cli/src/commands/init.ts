import { EOL } from "os";
import { exec } from "../common/exec";
import { initTemplate } from "../common/module";
import { logger } from "../common/logger";
import { prompt } from "inquirer";
import { readDir } from "../common/readdir";
import { resolve, basename } from "path";
import { writeFileSync } from "fs";

export async function init(template: string) {
  // 检查非空
  const files = await readDir(process.cwd());
  if (files && files.length > 0) {
    throw new Error("Current directory is non-empty directory");
  }
  // 下载模板
  logger.info("Initializing app ...");
  template = template || "default";
  const pkgName = `noka-template-${template}`;
  await initTemplate(pkgName, process.cwd());
  // 更新信息
  const pkgFile = resolve(process.cwd(), "./package.json");
  const pkg = require(pkgFile);
  const answers = await prompt([
    {
      type: "input",
      message: "Enter the application name:",
      name: "name",
      default: basename(process.cwd()),
      validate: value => !!value
    },
    {
      type: "input",
      message: "Enter the application version:",
      name: "version",
      default: "1.0.0",
      validate: value => !!value
    }
  ]);
  Object.assign(pkg, answers);
  writeFileSync(pkgFile, JSON.stringify(pkg, null, "") + EOL);
  // 安装依赖
  logger.info("Installing dependents ...");
  await exec("npm i");
  logger.info("finished");
}
