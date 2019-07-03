import chalk from "chalk";
import { EOL } from "os";
import { format } from "util";

const colors: { [name: string]: Function } = {
  log: (text: any) => text,
  info: chalk.green.bind(chalk),
  warn: chalk.yellow.bind(chalk),
  error: chalk.red.bind(chalk)
};

function wrapConsole(originConsole: any) {
  const newConsole = Object.create(originConsole);
  ["log", "info", "warn", "error"].forEach(name => {
    const func = newConsole[name];
    newConsole[name] = (formater: string, ...args: any[]) => {
      const text = format(formater, ...args);
      if (text.includes(EOL)) {
        return func.call(newConsole, formater, ...args);
      }
      const time = `[${new Date().toLocaleString()}]`;
      return func.call(newConsole, chalk.blue(time), colors[name](text));
    };
  });
  return newConsole as Console;
}

export const logger = wrapConsole(console);
