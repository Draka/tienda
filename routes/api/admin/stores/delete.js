const { deleteS3 } = require('../../../../libs/delete_s3.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const adminQuery = {
    _id: req.params.storeID,
    userID: req.user._id,
  };
  async.auto({
    validate: (cb) => {
      if (req.user.admin) {
        delete adminQuery.userID;
      }
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne(adminQuery)
        .exec(cb);
    }],
    check: ['store', (results, cb) => {
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No tienes permisos para ejecutar esta acción.' });
        return cb(listErrors(401, null, errors));
      }
      cb();
    }],
    queryCategory: ['check', (_results, cb) => {
      models.Category
        .find({ storeID: req.params.storeID })
        .exec(cb);
    }],
    queryCoverageArea: ['check', (_results, cb) => {
      models.CoverageArea
        .find({ storeID: req.params.storeID })
        .exec(cb);
    }],
    queryPlace: ['check', (_results, cb) => {
      models.Place
        .find({ storeID: req.params.storeID })
        .exec(cb);
    }],
    queryProduct: ['check', (_results, cb) => {
      models.Product
        .find({ storeID: req.params.storeID })
        .exec(cb);
    }],
    deleteCategory: ['queryCategory', (results, cb) => {
      async.each(results.queryCategory, (query, cb) => query.remove(cb), cb);
    }],
    deleteCoverageArea: ['queryCoverageArea', (results, cb) => {
      async.each(results.queryCoverageArea, (query, cb) => query.remove(cb), cb);
    }],
    deletePlace: ['queryPlace', (results, cb) => {
      async.each(results.queryPlace, (query, cb) => query.remove(cb), cb);
    }],
    deleteProduct: ['queryProduct', (results, cb) => {
      async.each(results.queryProduct, (query, cb) => {
        async.auto({
          deleteS3: (cb) => {
            async.each(query.images, (i, cb) => {
              deleteS3(`tenancy/${appCnf.tenancy}/ecommerce/${appCnf.s3.folder}/${req.params.storeID}/products/${query._id}/${i}`, cb);
            }, cb);
          },
          delete: ['deleteS3', (results, cb) => {
            query.remove(cb);
          }],
        }, cb);
      }, cb);
    }],
    deleteImages: ['deleteCategory', 'deleteCoverageArea', 'deletePlace', 'deleteProduct', (results, cb) => {
      deleteS3(`tenancy/${appCnf.tenancy}/ecommerce/${appCnf.s3.folder}/${req.params.storeID}`, cb);
    }],
    deleteStore: ['deleteImages', (results, cb) => {
      results.store.remove(cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.save);
  });
};
