module.exports = {
  beforeHooks: {
    async dev() {
      utils.exec(`webpack serve`);
    },
  },
  afterHooks: {
    async build({ utils }) {
      await utils.exec(`webpack`);
    },
  },
};