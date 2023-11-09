import { spawn } from "node:child_process";

const tsr = require.resolve("ts-node/register");

function launch(entry: string, options?: DaemonOptions) {
  return new Promise((resolve) => {
    const cp = spawn("node", ["-r", tsr, entry], {
      ...options,
      stdio: "inherit",
    });
    cp.on("exit", () => resolve(cp));
  });
}

export type DaemonOptions = {
  env?: any;
  cwd?: string;
};

export async function daemon(entry: string, options?: DaemonOptions) {
  //eslint-disable-next-line no-constant-condition
  while (true) await launch(entry, options);
}
