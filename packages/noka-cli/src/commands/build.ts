import { del } from "noka-util";
import { AppInfo } from "../common/AppInfo";
import { clean } from "./clean";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";
import { test } from "./test";
import { Hooks } from "../common/Hooks";

export async function build(env: string, $1: string) {
  showBrand();
  logger.info("Prepare to build ...");
  if (!env) env = "production";
  await clean($1);
  await test(env, $1);
  logger.info("Start building...");
  const appInfo = new AppInfo({ $1 });
  if (!appInfo.existCompileConf) {
    throw new Error("No compilation configuration found");
  }
  const hooks = Hooks(appInfo);
  await hooks.beforeHooks.build();
  const tsc = findCommand(__dirname, "tsc");
  const copy = findCommand(__dirname, "copyfiles");
  const command = [
    `${copy} --up 1 ${appInfo.srcDir}/**/*.* ${appInfo.binDir}`,
    `${tsc} --pretty`,
  ];
  await exec(command, {
    cwd: appInfo.rootDir,
    env: { NOKA_ENV: env },
  });
  await del([`${appInfo.binDir}/**/*.ts`, `${appInfo.binDir}/**/*.map`]);
  await hooks.afterHooks.build();
  logger.info("finished");
}
