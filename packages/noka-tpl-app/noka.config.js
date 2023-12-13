const { resolve } = require("path");

module.exports = {
  beforeHooks: {
    async dev({ utils }) {
      utils.exec(`NODE_ENV=development webpack serve`);
    },
  },
  afterHooks: {
    async clean({ utils }) {
      await utils.del(resolve(__dirname, `./public/app/`));
    },
    async lint({ utils }) {
      const target = resolve(__dirname, './app/');
      await utils.exec(`eslint --ext .ts,.tsx ${target} --fix`);
    },
    async build({ utils }) {
      await utils.exec(`NODE_ENV=production webpack`);
    },
    async release({ utils }) {
      await utils.del(resolve(__dirname, `./release/{app,shared,types}/`));
    },
  },
};