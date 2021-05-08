const pug = require('pug');

exports.template = (data, plugin) => {
  const fn = pug.compileFile(`./modules/pages/plugins/${plugin}/view.pug`, {});
  const html = fn(data);
  return html;
};
