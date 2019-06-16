import * as del from "del";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";

export async function clean($1: string) {
  logger.log("清理构建结果...");
  const appInfo = new AppInfo({ $1 });
  await del(appInfo.distPath);
}
