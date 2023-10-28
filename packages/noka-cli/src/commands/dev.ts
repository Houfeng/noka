/** @format */

import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { existsSync } from "fs";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";

/**
 * 用开发模式启动 Noka 工程
 * @param env 环境名称
 */
export async function dev(env: string, $1: string) {
  showBrand();
  logger.info("Start development mode ...");
  if (!env || env === "development") env = "dev";
  const appInfo = new AppInfo({ env, $1 });
  if (!existsSync(appInfo.tsEntry)) throw new Error("No entry file found");
  const tsnd = findCommand(__dirname, "tsnd");
  const command = `${tsnd} ${appInfo.tsEntry}`;
  await exec(command, {
    cwd: appInfo.root,
    env: { NOKA_ENV: env },
  });
}
