/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');
const meta = require('../../libs/meta');

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
      async.auto({
        items: (cb) => {
          cb(null);
        },
        meta: ['items', (results, cb) => {
          meta.meta(req, slug, template({
            req,
            items: results.items,
          }, 'slider-hero'), true, cb);
        }],
      }, (err, results) => {
        obj.text = obj.text.replace(match[0], results.meta);
        cb(err);
      });
    }, cb);
  } else {
    cb();
  }
};
