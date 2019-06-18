import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";

export async function restart($1: string, name: string, all: string) {
  if (all) {
    const restarted: any = {};
    const apps = await pm.list();
    for (let app of apps) {
      if (restarted[app.name]) continue;
      logger.info("重启:", app.name);
      await pm.restart(app.name);
      restarted[app.name] = true;
    }
    logger.info("已重启所有应用");
  } else {
    const appInfo = new AppInfo({ $1 });
    await pm.restart(name || appInfo.jsEntry);
    logger.info("已重启应用");
  }
}
