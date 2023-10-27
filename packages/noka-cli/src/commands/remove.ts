import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";

export async function remove($1: string, name: string, all: string) {
  if (all) {
    const handled: any = {};
    const apps = await pm.list();
    for (const app of apps) {
      if (handled[app.name]) continue;
      await pm.remove(app.name);
      handled[app.name] = true;
      logger.info("Removed:", app.name);
    }
    logger.info("All applications have been removed");
  } else {
    const appInfo = new AppInfo({ $1 });
    await pm.remove(name || appInfo.jsEntry);
    logger.info("Application removed");
  }
}
