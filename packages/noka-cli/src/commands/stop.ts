import * as pm2 from "pm2";
import { AppInfo } from "../common/AppInfo";
import { handleError } from "../common/ErrorHandler";

export async function stop($1: string, name: string) {
  const appInfo = new AppInfo({ $1 });
  pm2.connect(err => {
    if (err) return handleError(err);
    pm2.stop(name || appInfo.jsEntry, err => {
      pm2.disconnect();
      if (err) return handleError(err);
    });
  });
}
