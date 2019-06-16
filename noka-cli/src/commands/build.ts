import * as del from "del";
import { AppInfo } from "../common/AppInfo";
import { clean } from "./clean";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { test } from "./test";

export async function build($1: string) {
  await clean($1);
  await test($1);
  const appInfo = new AppInfo({ $1 });
  const tsc = findCommand(__dirname, "tsc");
  const copy = findCommand(__dirname, "copyfiles");
  const command = [
    `${copy} --up 1 ${appInfo.srcPath}/**/*.* ${appInfo.distPath}`,
    `${tsc} --pretty`
  ];
  await exec(command, { cwd: appInfo.root });
  await del([`${appInfo.distPath}/**/*.ts`, `!${appInfo.distPath}/**/*.d.ts`]);
}
