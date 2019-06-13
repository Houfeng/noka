"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const findCommand_1 = require("../common/findCommand");
async function lint() {
    const tslint = findCommand_1.findCommand(__dirname, "tslint");
    const command = `${tslint} --project ./tsconfig.json --fix`;
    await child_process_1.exec(command);
}
exports.lint = lint;
