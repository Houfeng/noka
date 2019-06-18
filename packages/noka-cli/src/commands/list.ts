import * as pm from "../common/pm";
import { logger } from "../common/logger";

export async function list() {
  const apps = await pm.list();
  if (apps && apps.length > 1) {
    logger.info("所有应用:");
    logger.table(apps);
  } else {
    logger.info("无任何应用");
  }
}
