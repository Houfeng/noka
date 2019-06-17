import chalk from "chalk";
import { EOL } from "os";
import { format } from "util";

const { formatDate } = require("ntils");
const timeFormater = "yyyy-MM-dd hh:mm:ss";
const originConsole = console as any;

["log", "info", "warn", "error"].forEach(name => {
  const func = originConsole[name];
  originConsole[name] = (formater: string, ...args: any[]) => {
    const text = format(formater, ...args);
    if (text.includes(EOL)) {
      return func.call(originConsole, formater, ...args);
    }
    const time = `[${formatDate(new Date(), timeFormater)}]`;
    return func.call(originConsole, chalk.blue(time), text);
  };
});

export const logger = originConsole as Console;
