import { del } from "noka-util";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";
import { Hooks } from "../common/Hooks";

export async function clean($1: string) {
  logger.info("Clean up the build results ...");
  const appInfo = new AppInfo({ $1 });
  const hooks = Hooks(appInfo);
  await hooks.beforeHooks.clean();
  await del([
    appInfo.binDir,
    `${appInfo.rootDir}/types/`,
    `${appInfo.rootDir}/release/`,
  ]);
  await hooks.afterHooks.clean();
  logger.info("finished");
}
