/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');

module.exports = (req, obj, cb) => {
  if (/\[categories-best-sellers\]/.test(obj.text)) {
    const re = new RegExp('\\[categories-best-sellers\\]', 'igm');
    const matchAll = obj.text.matchAll(re);
    const matchs = [];
    for (const match of matchAll) {
      matchs.push(match);
    }
    async.eachLimit(matchs, 5, (match, cb) => {
      async.auto({
        items: (cb) => {
          cb(null, req.categories);
        },
      }, (err, results) => {
        obj.text = obj.text.replace(match[0], template({
          req,
          items: results.items,
        }, 'categories-best-sellers'));
        cb(err);
      });
    }, cb);
  } else {
    cb();
  }
};
