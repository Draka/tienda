const { modelSlug } = require('../../../libs/query.lib');
const { metaNoCache } = require('./meta');

const fragments = {};

function getPage(req, slug, cb) {
  const key = `__tenancy:${req.tenancy}__xpage_render__${slug}`;
  client.get(key, (_err, reply) => {
    if (reply) {
      cb(reply);
    } else {
      async.auto({
        item: (cb) => {
          modelSlug(req, 'Page', slug, cb);
        },
        meta: ['item', (results, cb) => {
          if (!results.item || !results.item.active) {
            return cb(null, '');
          }
          // Busca todos los meta para convertir
          metaNoCache(req, slug, results.item.html, true, cb);
        }],
      }, (err, results) => {
        setImmediate(cb, err, results.meta);
      });
    }
  });
}
module.exports = (req, page) => {
  getPage(req, page, (err, value) => {
    fragments[page] = value;
  });
  return fragments[page];
};
