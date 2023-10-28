/** @format */

import * as pm from "../common/pm";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";

export async function stop($1: string, name: string, all: string) {
  if (all) {
    const handled: any = {};
    const apps = await pm.list();
    for (const app of apps) {
      if (handled[app.name]) continue;
      await pm.stop(app.name);
      handled[app.name] = true;
      logger.info("Stopped:", app.name);
    }
    logger.info("All applications have been stopped");
  } else {
    const appInfo = new AppInfo({ $1 });
    await pm.stop(name || appInfo.jsEntry);
    logger.info("Application stopped");
  }
}
