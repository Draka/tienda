const { getCenterOfBounds } = require('geolib');
const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const { isAvailable } = require('../../libs/util.lib');

module.exports = (req, res, next) => {
  return res.redirect(301, '/');
  // Salta a otra url
  if (global.forbidden.indexOf(req.params.storeSlug) >= 0) {
    return next('route');
  }

  async.auto({
    user: (cb) => {
      cb(null, req.user);
    },
    store: (cb) => {
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    },
    postFind: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }
      putS3LogoPath(req, [results.store]);
      cb();
    }],
    places: ['postFind', (results, cb) => {
      queryStore.places(req, results.store._id, cb);
    }],
    products: ['postFind', (results, cb) => {
      models.Product
        .find({
          tenancy: req.tenancy,
          storeID: results.store._id,
          publish: 1,
        })
        .sort({
          updatedAt: -1,
        })
        .limit(24)
        .lean()
        .exec(cb);
    }],
    postFindProducts: ['products', (results, cb) => {
      putS3Path(req, results.products, results.store);
      _.each(results.products, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    const markers = results.places.map((i) => i.location.coordinates);
    let center = '';
    if (markers.length) {
      center = getCenterOfBounds(markers.map((p) => ({
        latitude: p[1], longitude: p[0],
      })));
    }

    res.render('pages/stores/index.pug', {
      req,
      store: results.store,
      places: results.places,
      markers,
      center,
      categories: results.categories,
      products: results.products,
      title: results.store.slogan ? `${results.store.name}, ${results.store.slogan}` : results.store.name,
      js: 'store',
      osm: true,
      notMenu: true,
    });
  });
};
