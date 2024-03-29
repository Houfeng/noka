import globby from "globby";
import { basename, resolve } from "path";
import { EOL } from "os";
import { initTemplate } from "../common/module";
import { logger } from "../common/logger";
import { prompt } from "inquirer";
import { readDir, rename } from "../common/fs";
import { showBrand } from "../common/brand";
import { writeFileSync } from "fs";

async function input() {
  return prompt([
    {
      type: "input",
      message: "Enter the name:",
      name: "name",
      default: basename(process.cwd()),
      validate: (value) => !!value,
    },
    {
      type: "input",
      message: "Enter initial version:",
      name: "version",
      default: "1.0.0",
      validate: (value) => !!value,
    },
  ]);
}

async function renameFiles(files: string[], extname: string) {
  return Promise.all(
    files.map((oldPath) => {
      const newPath = oldPath.slice(0, oldPath.length - extname.length);
      return rename(oldPath, newPath);
    }),
  );
}

export async function init(template: string) {
  showBrand();
  // 检查非空
  const files = await readDir(process.cwd());
  if (files && files.length > 0) {
    throw new Error("Current directory is non-empty directory");
  }
  // 下载模板
  logger.info("Initializing ...");
  template = template || "";
  const pkgName = `noka-tpl-${template || "site"}`;
  await initTemplate(pkgName, process.cwd());
  // 更新信息
  const pkgFile = resolve(process.cwd(), "./package.json");
  const pkg = require(pkgFile);
  Object.assign(pkg, await input());
  writeFileSync(pkgFile, JSON.stringify(pkg, null, "") + EOL);
  // 重命名处理
  await renameFiles(await globby("./**/*.rename", { dot: true }), ".rename");
  logger.info("finished");
}
