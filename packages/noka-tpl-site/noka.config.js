const { resolve } = require("path");

module.exports = {
  beforeHooks: {
    async dev({ utils }) {
      utils.exec(
        `tailwindcss -i ./assets/site.css -o ./public/site.css --watch`
      );
    },
  },
  afterHooks: {
    async clean({ utils }) {
      await utils.del(resolve(__dirname, `./public/site.css`));
    },
    async build({ utils }) {
      await utils.exec(
        `tailwindcss -i ./assets/site.css -o ./public/site.css --minify`
      );
    },
  },
};