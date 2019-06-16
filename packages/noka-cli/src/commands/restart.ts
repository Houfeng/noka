import * as pm2 from "pm2";
import { AppInfo } from "../common/AppInfo";
import { handleError } from "../common/ErrorHandler";
import { logger } from "../common/logger";

export async function restart($1: string, name: string) {
  logger.log("重启应用...");
  const appInfo = new AppInfo({ $1 });
  pm2.connect(err => {
    if (err) return handleError(err);
    pm2.restart(name || appInfo.jsEntry, err => {
      pm2.disconnect();
      if (err) return handleError(err);
    });
  });
}
