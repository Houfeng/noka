import { findCommand } from "../common/findCommand";
import { exec } from "../common/exec";

export async function dev(env: string) {
  const tsnd = findCommand(__dirname, "tsnd");
  const command = `NOKA_ENV=${env} ${tsnd} ./src/app.ts`;
  await exec(command);
}
