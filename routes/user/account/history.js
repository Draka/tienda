const query = require('../../../libs/query.lib');
const { putS3Path } = require('../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../libs/util.lib');

module.exports = (req, res, next) => {
  async.auto({
    history: (cb) => {
      query.userHistory(req, req.user._id, cb);
    },
    postFindProducts: ['history', (results, cb) => {
      if (!results.history) {
        return cb();
      }
      putS3Path(req, results.history.productIDs);
      _.each(results.history.productIDs, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const item = {
      seo: 'Tus artículos vistos recientemente',
    };
    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/categorias',
        text: 'Categorías',
      },
    ];

    res.render('pages/stores/product.pug', {
      req,
      breadcrumbs,
      products: results.products,
      item,
      title: 'Tus artículos vistos recientemente',
      menu: 'index',
      js: 'user',
    });
  });
};
