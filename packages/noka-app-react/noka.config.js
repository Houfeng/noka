module.exports = {
  beforeHooks: {
    async dev({ utils }) {
      utils.exec(`webpack watch`);
    },
  },
  afterHooks: {
    async build({ utils }) {
      await utils.exec(`webpack`);
    },
  },
};