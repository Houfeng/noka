"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const del = require("del");
const consts_1 = require("../common/consts");
async function clean() {
    await del(consts_1.DIST_PATH);
}
exports.clean = clean;
