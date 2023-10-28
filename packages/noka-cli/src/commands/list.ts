/** @format */

import * as pm from "../common/pm";
import { logger } from "../common/logger";

export async function list() {
  const apps = await pm.list();
  if (apps && apps.length > 1) {
    logger.info("All applications:");
    apps.forEach((app) => {
      app.cpu = app.cpu + "%";
      app.memory = (app.memory / 1024 / 1024).toFixed(2) + " MB";
    });
    //eslint-disable-next-line
    console.table(apps);
  } else {
    logger.info("No application");
  }
}
