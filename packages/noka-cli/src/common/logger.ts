import chalk from "chalk";
import { EOL } from "os";
import { format } from "util";

const { formatDate } = require("ntils");
const timeFormater = "yyyy-MM-dd hh:mm:ss";
const originConsole = console as any;

["log", "info", "warn", "error"].forEach(name => {
  const func = originConsole[name];
  originConsole[name] = (formater: string, ...args: any[]) => {
    if (
      formater.includes(EOL) ||
      args.some((str: string) => str.includes(EOL))
    ) {
      return func.call(originConsole, formater, ...args);
    }
    const time = `[${formatDate(new Date(), timeFormater)}]`;
    const text = format(formater, ...args);
    return func.call(originConsole, chalk.blue(time), text);
  };
});

export const logger = originConsole as Console;
