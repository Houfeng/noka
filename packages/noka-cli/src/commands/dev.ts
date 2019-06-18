import { AppInfo } from "../common/AppInfo";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";

/**
 * 用开发模式启动 Noka 工程
 * @param env 环境名称
 */
export async function dev(env: string, $1: string) {
  logger.info("启动开发模式...");
  const appInfo = new AppInfo({ env, $1 });
  const tsnd = findCommand(__dirname, "tsnd");
  const envSetter = env ? `NOKA_ENV=${env}` : "";
  const command = `${envSetter} ${tsnd} ${appInfo.tsEntry}`;
  await exec(command, { cwd: appInfo.root });
}
