"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const del = require("del");
const clean_1 = require("./clean");
const consts_1 = require("../common/consts");
const exec_1 = require("../common/exec");
const findCommand_1 = require("../common/findCommand");
const lint_1 = require("./lint");
async function build() {
    await clean_1.clean();
    await lint_1.lint();
    const tsc = findCommand_1.findCommand(__dirname, "tsc");
    const copy = findCommand_1.findCommand(__dirname, "copyfiles");
    const command = [
        `${copy} --up 1 ${consts_1.SRC_PATH}/**/*.* ${consts_1.DIST_PATH}`,
        `${tsc} --pretty`
    ];
    await exec_1.exec(command);
    await del([`${consts_1.SRC_PATH}/**/*.ts`, `!${consts_1.SRC_PATH}/**/*.d.ts`]);
}
exports.build = build;
