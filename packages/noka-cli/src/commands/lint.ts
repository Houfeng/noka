import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";

export async function lint($1: string) {
  const appInfo = new AppInfo({ $1 });
  const tslint = findCommand(__dirname, "tslint");
  const command = `${tslint} --project ${appInfo.tsConfigFile} --fix`;
  await exec(command, { cwd: appInfo.root });
}
