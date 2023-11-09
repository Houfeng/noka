import * as upgrade from "./common/upgrade";
import { build } from "./commands/build";
import { clean } from "./commands/clean";
import { cmdline } from "cmdline";
import { dev } from "./commands/dev";
import { init } from "./commands/init";
import { lint } from "./commands/lint";
import { logger } from "./common/logger";
import { normalize } from "path";
import { test } from "./commands/test";
import { release } from "./commands/release";

export * from "./common/Hooks";

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
  .action(init, "*")

  // dev
  .root.command(["dev"])
  .option(["-e", "--env"], "string")
  .action(dev, "*")

  // lint
  .root.command(["lint"])
  .action(lint, "*")

  // test
  .root.command(["test"])
  .action(test, "*")

  // clean
  .root.command(["clean"])
  .action(clean, "*")

  // build
  .root.command(["build"])
  .action(build, "*")

  // release
  .root.command(["release"])
  .action(release, "*")

  // ready
  .ready();
