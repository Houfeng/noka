import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { existsSync } from "fs";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";

export async function lint($1: string) {
  logger.info("Code checking ...");
  const appInfo = new AppInfo({ $1 });
  if (!existsSync(appInfo.tsConfigFile)) {
    throw new Error("No compilation configuration found");
  }
  const tslint = findCommand(__dirname, "tslint");
  const command = `${tslint} --project ${appInfo.tsConfigFile} --fix`;
  await exec(command, { cwd: appInfo.root });
  logger.info("finished");
}
