"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
function findCommand(dir, cmd) {
    const cmdPath = path_1.normalize(`${dir}/node_modules/.bin/${cmd}`);
    if (fs_1.existsSync(cmdPath))
        return cmdPath;
    if (dir === "/" || dir === "." || /^[a-z]\:\/\/$/i.test(dir)) {
        return;
    }
    return findCommand(path_1.dirname(dir), cmd);
}
exports.findCommand = findCommand;
