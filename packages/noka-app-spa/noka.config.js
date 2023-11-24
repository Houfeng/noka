const { resolve } = require("path");

module.exports = {
  beforeHooks: {
    async dev({ utils }) {
      utils.exec(`NODE_ENV=development webpack serve`);
    },
  },
  afterHooks: {
    async clean({ utils }) {
      const target = resolve(__dirname, `./assets/app/`);
      await utils.del(target);
    },
    async lint({ utils }) {
      const target = resolve(__dirname, './app/');
      await utils.exec(`eslint --ext .ts,.tsx ${target} --fix`);
    },
    async build({ utils }) {
      await utils.exec(`NODE_ENV=production webpack`);
    },
    async release({ utils }) {
      const target = resolve(__dirname, `./release/{app,shared,types}/`);
      await utils.del(target);
    },
  },
};