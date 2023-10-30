module.exports = {
  beforeHooks: {
    async dev({ utils }) {
      utils.exec(`webpack serve`);
    },
  },
  afterHooks: {
    async lint({ utils }) {
      await utils.exec(`eslint --ext .ts,.tsx ./app/ --fix`);
    },
    async build({ utils }) {
      await utils.exec(`webpack`);
    },
  },
};