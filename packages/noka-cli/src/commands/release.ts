/** @format */

import del from "del";
import { AppInfo } from "../common/AppInfo";
import { findCommand } from "../common/findCommand";
import { logger } from "../common/logger";
import { showBrand } from "../common/brand";
import { build } from "./build";
import mkdirp from "mkdirp";
import { resolve } from "path";
import { exec } from "../common/exec";

export function mkdir(dir: string) {
  return new Promise((resolve, reject) => {
    mkdirp(dir, (err) => (err ? reject(err) : resolve(dir)));
  });
}

export async function release(env: string, $1: string) {
  showBrand();
  await build(env, $1);
  logger.info("Prepare to release ...");
  const appInfo = new AppInfo({ $1 });
  await mkdir(resolve(appInfo.root, "./release"));
  const copy = findCommand(__dirname, "copyfiles");
  const command = [`${copy} --up 0 -e node_modules/ ./**/*.* ./release/`];
  await exec(command, {
    cwd: appInfo.root,
    env: { NOKA_ENV: env },
  });
  await del([`${appInfo.root}/release/src/`, `${appInfo.root}/release/temp/`]);
  logger.info("finished");
}