import * as pm from "../common/pm";
import { logger } from "../common/logger";

export async function list() {
  const apps = await pm.list();
  if (apps && apps.length > 1) {
    logger.info("All applications:");
    logger.table(apps);
  } else {
    logger.info("No application");
  }
}
