const { putS3LogoPath } = require('../../libs/put_s3_path.lib');
const queryStore = require('../../libs/query_store.lib');
const { putS3Path } = require('../../libs/put_s3_path.lib');
const { isAvailable } = require('../../libs/util.lib');

module.exports = (req, res, next) => {
  async.auto({
    store: (cb) => {
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    },
    postFind: ['store', (results, cb) => {
      if (!results.store) {
        return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
      }

      if (_.get(req, 'user.admin') || (`${req.user._id}` === `${results.store.userID}`)) {
        putS3LogoPath(req, [results.store]);
        cb();
      } else {
        if (!results.store.publish || !results.store.approve) {
          return cb(listErrors(404, null, [{ field: 'storeID', msg: 'El registro no existe.' }]));
        }
        putS3LogoPath(req, [results.store]);
        cb();
      }
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
      _.each(results.products, (product) => {
        product.storeID = results.store;
      });
      putS3Path(req, results.products);
      _.each(results.products, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
    productsOffert: ['postFind', (results, cb) => {
      const query = {
        publish: 1,
        $and: [
          {
            $and: [
              {
                $or: [
                  { 'available.start': { $exists: false } },
                  { 'available.start': null },
                  { 'available.start': '' },
                  { 'available.start': { $lte: new Date() } },
                ],
              },
              {
                $or: [
                  { 'available.end': { $exists: false } },
                  { 'available.end': null },
                  { 'available.end': '' },
                  { 'available.end': { $gte: new Date() } },
                ],
              }],
          },
          {
            $or: [
              {
                $and: [
                  { 'offer.available.start': { $lte: new Date() } },
                  { 'offer.available.end': { $gte: new Date() } },
                ],
              },
              {
                $and: [
                  { 'offer.available.start': { $lte: new Date() } },
                  {
                    $or: [
                      { 'offer.available.end': null },
                      { 'offer.available.end': '' },
                      { 'offer.available.end': { $exists: false } },
                    ],
                  },
                ],
              },
              {
                $and: [
                  { 'offer.available.end': { $gte: new Date() } },
                  {
                    $or: [
                      { 'offer.available.start': null },
                      { 'offer.available.start': '' },
                      { 'offer.available.start': { $exists: false } },
                    ],
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      { 'offer.available.end': null },
                      { 'offer.available.end': '' },
                      { 'offer.available.end': { $exists: false } },
                    ],
                  },
                  {
                    $or: [
                      { 'offer.available.start': null },
                      { 'offer.available.start': '' },
                      { 'offer.available.start': { $exists: false } },
                    ],
                  },
                ],
              }],
          }],
        'offer.percentage': { $gt: 0 },
        storeID: results.store._id,
      };
      models.Product
        .find(query)
        .sort({
          'offer.available.end': -1,
        })
        .lean()
        .limit(5)
        .exec(cb);
    }],
    postFindProductsOffert: ['productsOffert', (results, cb) => {
      _.each(results.productsOffert, (product) => {
        product.storeID = results.store;
      });
      putS3Path(req, results.productsOffert);
      _.each(results.productsOffert, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
    productsNew: ['postFind', (results, cb) => {
      const query = {
        publish: 1,
        $and: [
          {
            $or: [
              { 'available.start': { $exists: false } },
              { 'available.start': null },
              { 'available.start': '' },
              { 'available.start': { $lte: new Date() } },
            ],
          },
          {
            $or: [
              { 'available.end': { $exists: false } },
              { 'available.end': null },
              { 'available.end': '' },
              { 'available.end': { $gte: new Date() } },
            ],
          },
        ],
        storeID: results.store._id,
      };
      models.Product
        .find(query)
        .sort({
          createdAt: -1,
        })
        .lean()
        .limit(5)
        .exec(cb);
    }],
    postFindProductsNew: ['productsNew', (results, cb) => {
      _.each(results.productsNew, (product) => {
        product.storeID = results.store;
      });
      putS3Path(req, results.productsNew);
      _.each(results.productsNew, (product) => {
        product.isAvailable = isAvailable(product);
      });
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.productsOffert.length && results.productsOffert.length < 5) {
      for (let index = results.productsOffert.length; index < 5; index++) {
        results.productsOffert.push(null);
      }
    }
    if (results.productsNew.length && results.productsNew.length < 5) {
      for (let index = results.productsNew.length; index < 5; index++) {
        results.productsNew.push(null);
      }
    }

    res.render('pages/stores/index.pug', {
      req,
      store: results.store,
      xofferts: results.productsOffert,
      xnew: results.productsNew,
      products: results.products,
      title: results.store.slogan ? `${results.store.name}, ${results.store.slogan}` : results.store.name,
      js: 'store',
      osm: true,
      notMenu: true,
    });
  });
};
