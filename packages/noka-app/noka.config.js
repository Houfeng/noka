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
      const target = resolve(__dirname, `./public/public/`);
      await utils.del(target);
    },
    async build({ utils }) {
      utils.exec(
        `tailwindcss -i ./assets/site.css -o ./public/site.css --minify`
      );
    },
  },
};