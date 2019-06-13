"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findCommand_1 = require("../common/findCommand");
const exec_1 = require("../common/exec");
const consts_1 = require("../common/consts");
async function dev(env) {
    const tsnd = findCommand_1.findCommand(__dirname, "tsnd");
    const command = `NOKA_ENV=${env} ${tsnd} ${consts_1.SRC_PATH}/app.ts`;
    await exec_1.exec(command);
}
exports.dev = dev;
