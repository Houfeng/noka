import * as del from "del";
import { AppInfo } from "../common/AppInfo";

export async function clean($1: string) {
  const appInfo = new AppInfo({ $1 });
  await del(appInfo.distPath);
}
