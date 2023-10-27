import updateNotifier from "update-notifier";

const pkg = require("../../package.json");

export function check() {
  const updateCheckInterval = 1000 * 60 * 60;
  const boxenOpts = {
    padding: 1,
    margin: 0,
    align: "center",
    borderColor: "yellow",
    borderStyle: "single"
  };
  const isGlobal = true;
  updateNotifier({ pkg, updateCheckInterval }).notify({ isGlobal, boxenOpts });
}
