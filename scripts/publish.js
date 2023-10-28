const { dirname } = require("path");
const { formatDate } = require("ntils");
const { EOL } = require("os");

const { CI, DN_ENV } = process.env;

module.exports = () => {
  return async (next, ctx) => {
    const { console, utils } = ctx;
    const tag = DN_ENV === 'production' ? 'latest' : 'dev';
    console.info('发布: 生成 Tag', tag);
    console.log('发布: 生成版本号');
    if (!CI) await ctx.exec({ name: 'version' });
    const pkgFiles = (await utils.files('./packages/*/package.json'));
    const buildId = formatDate(new Date(), 'yyyyMMddhhmmss');
    const version = CI
      ? `${ctx.project.version}-${tag}.${buildId}`
      : ctx.project.version;
    await Promise.all(pkgFiles.map(async (file) => {
      const pkg = JSON.parse((await utils.readFile(file)).toString());
      pkg.version = version;
      Object.keys(pkg.dependencies).map(async (key) => {
        if (!key.startsWith('noka')) return;
        pkg.dependencies[key] = version;
      });
      await utils.writeFile(file, JSON.stringify(pkg, null, '  ') + EOL);
    }));
    if (!CI) console.log('发布: 重新构建');
    if (!CI) await utils.exec([`dn run test && dn run build`]);
    console.log('发布: 执行发布');
    const libFiles = pkgFiles.filter(file => !file.includes('ai-app'));
    for (let file of libFiles) {
      if (tag === 'latest') {
        await utils.exec([`cd ${dirname(file)}`, `tnpm pu`]);
      } else {
        await utils.exec([`cd ${dirname(file)}`, `tnpm pu --tag ${tag}`]);
      }
    }
    console.log('发布: 提交代码');
    if (!CI) await ctx.exec({ name: 'submitter' });
    next();
  };
}