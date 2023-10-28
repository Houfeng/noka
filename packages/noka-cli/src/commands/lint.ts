/** @format */

import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { existsSync } from "fs";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";

export async function lint($1: string) {
  showBrand();
  logger.info("Code checking ...");
  const appInfo = new AppInfo({ $1 });
  if (!existsSync(appInfo.tsConfigFile)) {
    throw new Error("No compilation configuration found");
  }
  const eslint = findCommand(__dirname, "eslint");
  const cwd = appInfo.root;
  const options = "--fix --no-error-on-unmatched-pattern";
  const command = `${eslint} --ext .ts,.tsx ${cwd}/src/* ${options}`;
  await exec(command, { cwd });
  logger.info("finished");
}
