import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { lint } from "./lint";
import { logger } from "../common/logger";
import { resolve } from "path";
import { Hooks } from "../common/Hooks";

export async function test(env: string, $1: string) {
  await lint($1);
  logger.info("Unit testing in progress ...");
  if (!env) env = "test";
  const appInfo = new AppInfo({ $1 });
  if (!appInfo.existCompileConf) {
    throw new Error("No compilation configuration found");
  }
  const hooks = Hooks(appInfo);
  await hooks.beforeHooks.test();
  const mocha = findCommand(__dirname, "mocha");
  const tsRegister = require.resolve("ts-node/register");
  const testFiles = resolve(appInfo.srcDir, "./**/*.spec.ts");
  const command = `${mocha} -r ${tsRegister} ${testFiles}`;
  await exec(command, {
    cwd: appInfo.rootDir,
    env: { NOKA_ENV: env },
  });
  await hooks.afterHooks.test();
  logger.info("finished");
}
