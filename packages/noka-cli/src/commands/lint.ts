import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";

export async function lint($1: string) {
  logger.log("执行语法检查...");
  const appInfo = new AppInfo({ $1 });
  const tslint = findCommand(__dirname, "tslint");
  const command = `${tslint} --project ${appInfo.tsConfigFile} --fix`;
  await exec(command, { cwd: appInfo.root });
}
