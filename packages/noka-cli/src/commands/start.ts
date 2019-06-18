import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { cpus } from "os";
import { logger } from "../common/logger";

export async function start(env: string, $1: string, name: string) {
  const appInfo = new AppInfo({ env, $1 });
  await pm.start({
    name: name || appInfo.name,
    script: appInfo.jsEntry,
    exec_mode: "cluster",
    instances: cpus.length,
    env: {
      ...process.env,
      NOKA_ROOT: appInfo.root,
      NOKA_ENV: env
    }
  });
  logger.info("已启动应用");
}
