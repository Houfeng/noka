import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { lint } from "./lint";
import { resolve } from "path";

export async function test($1: string) {
  await lint($1);
  const appInfo = new AppInfo({ $1 });
  const mocha = findCommand(__dirname, "mocha");
  const tsNode = findCommand(__dirname, "ts-node");
  const tsRegister = resolve(tsNode, "../../ts-node/register");
  const testFiels = resolve(appInfo.srcPath, "./**/*.spec.ts");
  const command = `${mocha} -r ${tsRegister} ${testFiels}`;
  await exec(command, { cwd: appInfo.root });
}
