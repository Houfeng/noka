import { ChildProcess } from "child_process";
import { normalize } from "path";
import { platform } from "os";

const shify = require("shify");
const BufferHelper = require("bufferhelper");

const isWin = platform() === "win32";

export function exec(script: string[] | string, opts?: any) {
  opts = opts || {};
  opts.cwd = opts.cwd || process.cwd();
  opts.env = { ...process.env, ...opts.env };
  const bin = normalize(`${opts.cwd}/node_modules/.bin`);
  opts.env.PATH = `${opts.env.PATH}${isWin ? ";" : ":"}${bin}`;
  opts.stdio = opts.stdio || "inherit";
  opts.builtIn = true;
  script = script || "";
  return new Promise((resolve, reject) => {
    let childProcess = shify(script, opts);
    if (opts.onStart) opts.onStart(childProcess);
    childProcess.on("exit", (code: number) => {
      if (code !== 0) {
        return reject(new Error(`Script Error, exit ${code}`));
      }
      if (opts.onExit) opts.onExit(code, childProcess);
      resolve(childProcess);
    });
  });
}

export async function resultOfExec(script: string[] | string, opts?: any) {
  const helper = new BufferHelper();
  const onStart = (child: ChildProcess) => {
    child.stdout.on("data", chunk => helper.concat(chunk));
    child.stderr.on("data", chunk => helper.concat(chunk));
  };
  await exec(script, { ...opts, stdio: "pipe", onStart });
  return helper.toBuffer().toString();
}
