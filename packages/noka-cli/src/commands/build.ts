import * as del from "del";
import { AppInfo } from "../common/AppInfo";
import { clean } from "./clean";
import { exec } from "../common/exec";
import { existsSync } from "fs";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";
import { test } from "./test";

export async function build($1: string) {
  logger.info("Prepare to build ...");
  await clean($1);
  await test($1);
  logger.info("Start building...");
  const appInfo = new AppInfo({ $1 });
  if (!existsSync(appInfo.tsConfigFile)) {
    throw new Error("No compilation configuration found");
  }
  const tsc = findCommand(__dirname, "tsc");
  const copy = findCommand(__dirname, "copyfiles");
  const command = [
    `${copy} --up 1 ${appInfo.srcPath}/**/*.* ${appInfo.distPath}`,
    `${tsc} --pretty`
  ];
  await exec(command, { cwd: appInfo.root });
  await del([`${appInfo.distPath}/**/*.ts`, `!${appInfo.distPath}/**/*.d.ts`]);
  logger.info("finished");
}
