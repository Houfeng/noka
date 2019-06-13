import * as del from "del";
import { clean } from "./clean";
import { DIST_PATH, SRC_PATH } from "../common/consts";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { lint } from "./lint";

export async function build() {
  await clean();
  await lint();
  const tsc = findCommand(__dirname, "tsc");
  const copy = findCommand(__dirname, "copyfiles");
  const command = [
    `${copy} --up 1 ${SRC_PATH}/**/*.* ${DIST_PATH}`,
    `${tsc} --pretty`
  ];
  await exec(command);
  await del([`${SRC_PATH}/**/*.ts`, `!${SRC_PATH}/**/*.d.ts`]);
}
