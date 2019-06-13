import { findCommand } from "../common/findCommand";
import { exec } from "../common/exec";
import { SRC_PATH } from "../common/consts";

export async function dev(env: string) {
  const tsnd = findCommand(__dirname, "tsnd");
  const command = `NOKA_ENV=${env} ${tsnd} ${SRC_PATH}/app.ts`;
  await exec(command);
}
