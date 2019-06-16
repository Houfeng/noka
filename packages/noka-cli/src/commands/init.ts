import { copy } from "../common/copy";
import { exec } from "../common/exec";
import { logger } from "../common/logger";
import { resolve } from "path";

export async function init(template: string) {
  logger.log("初始化工程...");
  const cwd = process.cwd();
  // 安装模板
  template = template || "default";
  const tplRoot = resolve(__dirname, "../../templates");
  const pkgName = `noka-template-${template}`;
  const pkgRepo = "http://registry.npm.taobao.org/";
  await exec(`npm i ${pkgName}@latest --registry=${pkgRepo}`, { cwd: tplRoot });
  // 复制文件
  const pkgRoot = resolve(tplRoot, `./node_modules/${pkgName}`);
  await copy([`${pkgRoot}/**/*.*`], cwd);
  await exec(`npm i --registry=${pkgRepo}`, { cwd });
  // 调整内容
}
