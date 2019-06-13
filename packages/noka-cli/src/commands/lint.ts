import { exec } from "child_process";
import { findCommand } from "../common/findCommand";

export async function lint() {
  const tslint = findCommand(__dirname, "tslint");
  const command = `${tslint} --project ./tsconfig.json --fix`;
  await exec(command);
}
