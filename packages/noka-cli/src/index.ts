import { build } from "./commands/build";
import { clean } from "./commands/clean";
import { dev } from "./commands/dev";
import { init } from "./commands/init";
import { lint } from "./commands/lint";
import { list } from "./commands/list";
import { normalize } from "path";
import { remove } from "./commands/remove";
import { restart } from "./commands/restart";
import { start } from "./commands/start";
import { stop } from "./commands/stop";
import { test } from "./commands/test";

const cmdline = require("cmdline");
const pkg = require("../package.json");

cmdline
  .version(pkg.version)
  .help(normalize(`@${__dirname}/assets/help.txt`))

  // init
  .root.command(["init"])
  .option(["-t", "--template"], "string")
  .action(init, false)

  // dev
  .root.command(["dev"])
  .option(["-e", "--env"], "string")
  .action(dev, false)

  // lint
  .root.command(["lint"])
  .action(lint, false)

  // test
  .root.command(["test"])
  .action(test, false)

  // clean
  .root.command(["clean"])
  .action(clean, false)

  // build
  .root.command(["build"])
  .action(build, false)

  // start
  .root.command(["start"])
  .option(["-n", "--name"], "string")
  .option(["-e", "--env"], "string")
  .action(start, false)

  // list
  .root.command(["list"])
  .action(list, false)

  // restart
  .root.command(["restart"])
  .option(["-n", "--name"], "string")
  .action(restart, false)

  // stop
  .root.command(["stop"])
  .option(["-n", "--name"], "string")
  .action(stop, false)

  // remove
  .root.command(["remove"])
  .option(["-n", "--name"], "string")
  .action(remove, false)

  // ready
  .ready();
