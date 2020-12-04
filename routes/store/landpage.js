const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const query = require('../../libs/query.lib');
const queryStore = require('../../libs/query_store.lib');

module.exports = (req, res, next) => {
  async.auto({
    user: (cb) => {
      if (!req.user || !req.user._id) {
        return cb();
      }
      cb(null, global.session);
    },
    stores: ['user', (results, cb) => {
      queryStore.stores(cb);
    }],
    postFind: ['stores', (results, cb) => {
      putS3LogoPath(results.stores);
      cb();
    }],

  }, (err, results) => {
    if (err) {
      return next(err);
    }
    console.log(results.stores);

    res.render('pages/landpage.pug', {
      user: results.user,
      stores: results.stores,
      title: 'Centro Comercial Virtual',
      menu: 'index',
      js: 'page',
    });
  });
};
