import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { existsSync } from "fs";
import { findCommand } from "../common/findCommand";
import { lint } from "./lint";
import { logger } from "../common/logger";
import { resolve } from "path";

export async function test($1: string) {
  await lint($1);
  logger.info("Unit testing in progress ...");
  const appInfo = new AppInfo({ $1 });
  if (!existsSync(appInfo.tsConfigFile)) {
    throw new Error("No compilation configuration found");
  }
  const mocha = findCommand(__dirname, "mocha");
  const tsNode = findCommand(__dirname, "ts-node");
  const tsRegister = resolve(tsNode, "../../ts-node/register");
  const testFiels = resolve(appInfo.srcPath, "./**/*.spec.ts");
  const command = `${mocha} -r ${tsRegister} ${testFiels}`;
  await exec(command, { cwd: appInfo.root });
  logger.info("finished");
}
