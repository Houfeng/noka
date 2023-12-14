import { AppInfo } from "../common/AppInfo";
import { existsSync } from "fs";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";
import { Hooks } from "../common/Hooks";
import { daemon } from "../common/daemon";

/**
 * 用开发模式启动 Noka 工程
 * @param env 环境名称
 */
export async function dev(env: string, $1: string) {
  showBrand();
  logger.info("Start local development ...");
  if (!env) env = "development";
  const appInfo = new AppInfo({ env, $1 });
  if (!existsSync(appInfo.srcEntry)) throw new Error("No entry file found");
  const hooks = Hooks(appInfo);
  await hooks.beforeHooks.dev();
  await daemon(appInfo.srcEntry, {
    cwd: appInfo.rootDir,
    env: { ...process.env, NOKA_ENV: env },
  });
}
