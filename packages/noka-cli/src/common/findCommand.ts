/** @format */

import { dirname, normalize } from "path";
import { existsSync } from "fs";

export function findCommand(dir: string, cmd: string): string | undefined {
  const cmdPath = normalize(`${dir}/node_modules/.bin/${cmd}`);
  if (existsSync(cmdPath)) return cmdPath;
  if (dir === "/" || dir === "." || /^[a-z]:\/\/$/i.test(dir)) {
    return;
  }
  return findCommand(dirname(dir), cmd);
}
