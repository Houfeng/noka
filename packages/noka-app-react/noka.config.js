module.exports = {
  beforeHooks: {
    async dev({ utils }) {
      utils.exec(`NODE_ENV=development webpack serve`);
    },
  },
  afterHooks: {
    async lint({ utils }) {
      await utils.exec(`eslint --ext .ts,.tsx ./app/ --fix`);
    },
    async build({ utils }) {
      await utils.exec(`NODE_ENV=production webpack`);
    },
  },
};