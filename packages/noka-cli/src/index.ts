import * as upgrade from "./common/upgrade";
import { build } from "./commands/build";
import { clean } from "./commands/clean";
import { cmdline } from "cmdline";
import { dev } from "./commands/dev";
import { init } from "./commands/init";
import { lint } from "./commands/lint";
import { list } from "./commands/list";
import { logger } from "./common/logger";
import { normalize } from "path";
import { remove } from "./commands/remove";
import { restart } from "./commands/restart";
import { start } from "./commands/start";
import { startup } from "./commands/startup";
import { stop } from "./commands/stop";
import { test } from "./commands/test";

upgrade.check();

const pkg = require("../package.json");

function onError(err: Error) {
  logger.error(process.env.NOKA_CLI_DEBUG ? err : err.message);
  process.exit(2);
}

cmdline
  .console(logger)
  .error(onError)
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
  .option(["-e", "--env"], "string")
  .option(["-n", "--name"], "string")
  .action(start, false)

  // list
  .root.command(["list", "ls"])
  .action(list, false)

  // restart
  .root.command(["restart", "rs"])
  .option(["-n", "--name"], "string")
  .option(["-a", "--all"], "switch")
  .action(restart, false)

  // stop
  .root.command(["stop"])
  .option(["-n", "--name"], "string")
  .option(["-a", "--all"], "switch")
  .action(stop, false)

  // remove
  .root.command(["remove", "rm"])
  .option(["-n", "--name"], "string")
  .option(["-a", "--all"], "switch")
  .action(remove, false)

  // startup
  .root.command(["startup", "su"])
  .option(["-p", "--platform"], "string")
  .action(startup, false)

  // ready
  .ready();
