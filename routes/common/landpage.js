const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    items: ['user', (results, cb) => {
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

    res.render('pages/landpage.pug', {
      req,
      user: results.user,
      items: results.items,
      title: _.get(appCnf, 'site.title'),
      menu: 'index',
      js: 'page',
    });
  });
};
