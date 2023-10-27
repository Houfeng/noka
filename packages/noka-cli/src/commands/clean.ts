import del from "del";
import { AppInfo } from "../common/AppInfo";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";

export async function clean($1: string) {
  showBrand();
  logger.info("Clean up the build results ...");
  const appInfo = new AppInfo({ $1 });
  await del(appInfo.distPath);
  logger.info("finished");
}
