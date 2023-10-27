import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";

export async function restart($1: string, name: string, all: string) {
  if (all) {
    const handled: any = {};
    const apps = await pm.list();
    for (const app of apps) {
      if (handled[app.name]) continue;
      await pm.restart(app.name);
      handled[app.name] = true;
      logger.info("Restarted:", app.name);
    }
    logger.info("All applications have been restarted");
  } else {
    const appInfo = new AppInfo({ $1 });
    await pm.restart(name || appInfo.jsEntry);
    logger.info("Application restarted");
  }
}
