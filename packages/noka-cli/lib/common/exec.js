"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const os_1 = require("os");
const shify = require("shify");
const BufferHelper = require("bufferhelper");
const debug = require("debug")("exec");
const isWin = os_1.platform() === "win32";
function exec(script, opts) {
    opts = opts || {};
    opts.cwd = opts.cwd || process.cwd();
    opts.env = { ...process.env, ...opts.env };
    const bin = path_1.normalize(`${opts.cwd}/node_modules/.bin`);
    opts.env.PATH = `${opts.env.PATH}${isWin ? ";" : ":"}${bin}`;
    opts.stdio = opts.stdio || "inherit";
    opts.builtIn = true;
    debug("opts", opts);
    script = script || "";
    debug("script", opts);
    return new Promise((resolve, reject) => {
        let childProcess = shify(script, opts);
        if (opts.onStart)
            opts.onStart(childProcess);
        childProcess.on("exit", (code) => {
            debug("exit", code);
            if (code !== 0) {
                return reject(new Error(`Script Error, exit ${code}`));
            }
            if (opts.onExit)
                opts.onExit(code, childProcess);
            resolve(childProcess);
        });
    });
}
exports.exec = exec;
async function resultOfExec(script, opts) {
    const helper = new BufferHelper();
    const onStart = (child) => {
        child.stdout.on("data", chunk => helper.concat(chunk));
        child.stderr.on("data", chunk => helper.concat(chunk));
    };
    await exec(script, { ...opts, stdio: "pipe", onStart });
    return helper.toBuffer().toString();
}
exports.resultOfExec = resultOfExec;
