import * as del from "del";
import { clean } from "./clean";
import { exec } from "../common/exec";
import { findCommand } from "../common/findCommand";
import { lint } from "./lint";

export async function build() {
  await clean();
  await lint();
  const tsc = findCommand(__dirname, "tsc");
  const copy = findCommand(__dirname, "copyfiles");
  const command = [`${copy} --up 1 ./src/**/*.* lib/`, `${tsc} --pretty`];
  await exec(command);
  await del(["./lib/**/*.ts", "!./lib/**/*.d.ts"]);
}
