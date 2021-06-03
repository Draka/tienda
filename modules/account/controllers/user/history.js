const query = require('../../libs/query.lib');
const { putS3Path } = require('../../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../../libs/util.lib');

module.exports = (req, res, next) => {
  async.auto({
    history: (cb) => {
      query.userHistory(req, req.user._id, cb);
    },
    postFindProducts: ['history', (results, cb) => {
      if (!results.history) {
        return cb();
      }
      const products = results.history.productIDs.map((i) => i.productID);
      putS3Path(req, products);
      _.each(products, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb(null, products);
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
        link: '/usuario',
        text: 'Cuenta',
      },
      {
        link: '/usuario/historial',
        text: 'Historial',
        active: true,
      },
    ];

    res.render('../modules/account/view/user/history.pug', {
      req,
      breadcrumbs,
      products: _.get(results, 'postFindProducts') || [],
      item,
      title: 'Tus artículos vistos recientemente',
      menu: 'index',
      js: 'user',
    });
  });
};
