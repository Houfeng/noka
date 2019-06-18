import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";

export async function stop($1: string, name: string, all: string) {
  if (all) {
    const restarted: any = {};
    const apps = await pm.list();
    for (let app of apps) {
      if (restarted[app.name]) continue;
      logger.info("停止:", app.name);
      await pm.stop(app.name);
      restarted[app.name] = true;
    }
    logger.info("已停止所有应用");
  } else {
    const appInfo = new AppInfo({ $1 });
    await pm.restart(name || appInfo.jsEntry);
    logger.info("已停止应用");
  }
}
