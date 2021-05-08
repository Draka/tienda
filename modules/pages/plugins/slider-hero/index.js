/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');

module.exports = (req, obj, cb) => {
  if (/\[slider-hero slug="([a-z0-9-, ]*)"\]/.test(obj.text)) {
    const re = new RegExp('\\[slider-hero slug="([a-z0-9-, ]*)"\\]', 'igm');
    const matchAll = obj.text.matchAll(re);
    const matchs = [];
    for (const match of matchAll) {
      matchs.push(match);
    }
    async.eachLimit(matchs, 5, (match, cb) => {
      const data = (match[1] || '').split(',');
      const slug = data[0];
      const limit = Math.max(parseInt(data[1], 10), 1) || 4;

      async.auto({
        items: (cb) => {
          cb(null);
        },
      }, (err, results) => {
        obj.text = obj.text.replace(match[0], template({
          req,
          items: results.items,
        }, 'slider-products'));
        cb(err);
      });
    }, cb);
  } else {
    cb();
  }
};
