import * as pm2 from "pm2";
import { AppInfo } from "../common/AppInfo";
import { cpus } from "os";
import { handleError } from "../common/ErrorHandler";
import { list } from "./list";

export async function start(env: string, $1: string, name: string) {
  const appInfo = new AppInfo({ env, $1 });
  pm2.connect(err => {
    if (err) return handleError(err);
    pm2.start(
      {
        name,
        script: appInfo.jsEntry,
        exec_mode: "cluster",
        instances: cpus.length,
        env: {
          ...process.env,
          NOKA_ROOT: appInfo.root,
          NOKA_ENV: env
        }
      },
      err => {
        pm2.disconnect();
        if (err) return handleError(err);
        list();
      }
    );
  });
}
