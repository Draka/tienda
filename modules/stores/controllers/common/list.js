const { putS3LogoPath } = require('../../../../libs/put_s3_path.lib');
const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => {
      cb();
    },
    items: ['validate', (results, cb) => {
      async.mapLimit(global.activities, 10, (activity, cb) => {
        async.auto({
          activity: (cb) => {
            cb(null, activity);
          },
          stores: (cb) => {
            queryStore.storesByPrimaryActivity(activity, cb);
          },
          postFind: ['stores', (results, cb) => {
            putS3LogoPath(results.stores);
            cb();
          }],
        }, cb);
      }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/tiendas',
        text: 'Tiendas',
        active: true,
      },
    ];

    const item = {
      seo: 'Lista de tiendas disponibles para visitar y comprar',
    };

    res.render('../modules/stores/views/common/list.pug', {
      session: req.user,
      item,
      items: results.items,
      title: 'Tiendas',
      breadcrumbs,
      js: 'page',
      q: req.query.q,
    });
  });
};
