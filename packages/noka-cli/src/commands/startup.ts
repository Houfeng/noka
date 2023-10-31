/** @format */

import * as pm from "../common/pm";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";

export async function startup($1: string, platform: string) {
  showBrand();
  platform = platform || $1;
  await pm.startup(platform);
  logger.info("Autostart has been enabled");
}
