const console3 = require("console3");
const utils = require("ntils");
const { colors } = console3;

["log", "info", "warn", "error"].forEach(name => {
  const func = console3[name];
  console3[name] = (...args: any[]) => {
    const text = [...args].join("").trim();
    if (text && !text.includes("\n")) {
      const time = utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
      console3.write(colors.blue(`[${time}] `));
    }
    func.call(console3, ...args);
  };
});

export const logger = console3;
