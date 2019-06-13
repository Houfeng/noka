"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./commands/build");
const clean_1 = require("./commands/clean");
const dev_1 = require("./commands/dev");
const init_1 = require("./commands/init");
const lint_1 = require("./commands/lint");
const list_1 = require("./commands/list");
const path_1 = require("path");
const remove_1 = require("./commands/remove");
const restart_1 = require("./commands/restart");
const start_1 = require("./commands/start");
const stop_1 = require("./commands/stop");
const test_1 = require("./commands/test");
const cmdline = require("cmdline");
const pkg = require("../package.json");
cmdline
    .version(pkg.version)
    .help(path_1.normalize(`@${__dirname}/assets/help.txt`))
    // init
    .root.command(["init"])
    .option(["-t", "--template"], "string")
    .action(init_1.init, false)
    // dev
    .root.command(["dev"])
    .option(["-e", "--env"], "string")
    .action(dev_1.dev, false)
    // lint
    .root.command(["lint"])
    .action(lint_1.lint, false)
    // test
    .root.command(["test"])
    .action(test_1.test, false)
    // clean
    .root.command(["clean"])
    .action(clean_1.clean, false)
    // build
    .root.command(["build"])
    .action(build_1.build, false)
    // start
    .root.command(["start"])
    .option(["-n", "--name"], "string")
    .option(["-e", "--env"], "string")
    .action(start_1.start, false)
    // list
    .root.command(["list"])
    .action(list_1.list, false)
    // restart
    .root.command(["restart"])
    .option(["-n", "--name"], "string")
    .action(restart_1.restart, false)
    // stop
    .root.command(["stop"])
    .option(["-n", "--name"], "string")
    .action(stop_1.stop, false)
    // remove
    .root.command(["remove"])
    .option(["-n", "--name"], "string")
    .action(remove_1.remove, false)
    // ready
    .ready();
