/** @format */

import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { cpus } from "os";
import { existsSync } from "fs";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";

export async function start(
  env: string,
  $1: string,
  name: string,
  cluster: string,
) {
  showBrand();
  if (!env) env = "production";
  const appInfo = new AppInfo({ env, $1 });
  if (!existsSync(appInfo.binEntry)) throw new Error("No entry file found");
  await pm.start({
    name: name || appInfo.name,
    script: appInfo.binEntry,
    exec_mode: "cluster",
    instances: cluster ? Number(cluster) : cpus.length,
    max_restarts: 10,
    env: {
      ...process.env,
      NOKA_ROOT: appInfo.root,
      NOKA_ENV: env,
    },
    output: `~/${appInfo.name}/logs/pm/output.log`,
    error: `~/${appInfo.name}/logs/pm/error.log`,
  });
  logger.info("The application is started");
}
