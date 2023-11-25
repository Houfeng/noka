import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";
import { Hooks } from "../common/Hooks";

export async function lint($1: string) {
  logger.info("Code checking ...");
  const appInfo = new AppInfo({ $1 });
  if (!appInfo.existCompileConf) {
    throw new Error("No compilation configuration found");
  }
  const hooks = Hooks(appInfo);
  await hooks.beforeHooks.lint();
  const eslint = findCommand(__dirname, "eslint");
  const cwd = appInfo.rootDir;
  const options = "--fix --no-error-on-unmatched-pattern";
  const command = `${eslint} --ext .ts,.tsx ${appInfo.srcDir}/* ${options}`;
  await exec(command, { cwd });
  await hooks.afterHooks.lint();
  logger.info("finished");
}
