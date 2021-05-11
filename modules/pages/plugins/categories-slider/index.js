/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');

module.exports = (req, obj, cb) => {
  if (/\[categories-slider\]/.test(obj.text)) {
    const re = new RegExp('\\[categories-slider\\]', 'igm');
    const matchAll = obj.text.matchAll(re);
    const matchs = [];
    for (const match of matchAll) {
      matchs.push(match);
    }
    async.eachLimit(matchs, 5, (match, cb) => {
      obj.text = obj.text.replace(match[0], template({
        req,
      }, 'categories-slider'));
      cb();
    }, cb);
  } else {
    cb();
  }
};
