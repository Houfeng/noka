import { findCommand } from "../common/findCommand";
import { exec } from "../common/exec";
import { AppInfo } from "../common/AppInfo";

/**
 * 用开发模式启动 Noka 工程
 * @param env 环境名称
 */
export async function dev(env: string, $1: string) {
  const appInfo = new AppInfo({ env, $1 });
  const tsnd = findCommand(__dirname, "tsnd");
  const command = `NOKA_ENV=${env} ${tsnd} ${appInfo.tsEntry}`;
  await exec(command, { cwd: appInfo.root });
}
