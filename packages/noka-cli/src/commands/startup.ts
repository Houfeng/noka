/** @format */

import * as pm from "../common/pm";
import { logger } from "../common/logger";

export async function startup($1: string, platform: string) {
  platform = platform || $1;
  await pm.startup(platform);
  logger.info("Autostart has been enabled");
}
