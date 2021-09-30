const { imageToS3 } = require('../../../../libs/image.lib');
const { deleteS3 } = require('../../../../libs/delete_s3.lib');
const query = require('../../../../libs/query.lib');
const { checkProduct } = require('../../../../modules/site/libs/check-store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });
  const body = _.pick(fbody, [
    'publish',
    'name',
    'inventory',
    'stock',
    'price',
    'sku',
    'upc',
    'brandText',
    'shortDescription',
    'longDescription',
    'featured',
    'features',
    'digital',
    'available',
    'groups',
    'imagesDeleted',
    'weight',
    'length',
    'height',
    'width',
    'amz',
    'images',
    'offer',
    'pickList',
  ]);
  body.tenancy = req.tenancy;

  const adminQuery = {
    tenancy: req.tenancy,
    _id: req.params.storeID,
    userID: req.user._id,
  };
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  if (body.digital && typeof body.digital.is !== 'undefined' && !body.digital.is) {
    _.set(body, 'digital.is', false);
  }

  if (_.get(body, 'available.start')) {
    body.available.start = moment.tz(body.available.start, global.tz);
  }
  if (_.get(body, 'available.end')) {
    body.available.end = moment.tz(body.available.end, global.tz);
  }
  if (_.get(body, 'offer.available.start')) {
    body.offer.available.start = moment.tz(body.offer.available.start, global.tz);
  }
  if (_.get(body, 'offer.available.end')) {
    body.offer.available.end = moment.tz(body.offer.available.end, global.tz);
  }

  async.auto({
    validate: (cb) => {
      if (body.name && !_.trim(body.name)) {
        errors.push({ field: 'name', msg: 'Escribe un nombre de Producto válido.' });
      }
      if (body.sku && !_.trim(body.sku)) {
        errors.push({ field: 'sku', msg: 'Escribe un SKU de Producto válido.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
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
    query: ['check', (_results, cb) => {
      models.Product
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.productID,
        })
        .exec(cb);
    }],
    uploadFile: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!req.files) {
        return cb();
      }
      if (!_.isArray(req.files.images)) {
        req.files.images = [req.files.images];
      }

      async.eachLimit(req.files.images, 10, (image, cb) => {
        let cimg;
        do {
          cimg = _.random(10000, 99999);
        } while (results.query.images.indexOf(cimg) !== -1);
        results.query.images.push(cimg);
        const pathImg = `${req.params.storeID}/products/${req.params.productID}/${cimg}`;
        imageToS3(req, pathImg, null, image, global.imagesSizes, true, 'contain', cb);
      }, cb);
    }],
    urlFile: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!req.body.urlFiles) {
        return cb();
      }
      req.body.urlFiles = req.body.urlFiles.split('\n');

      async.eachLimit(req.body.urlFiles, 10, (urlImg, cb) => {
        urlImg = _.trim(urlImg);
        if (!urlImg) {
          return cb();
        }
        let cimg;
        do {
          cimg = _.random(10000, 99999);
        } while (results.query.images.indexOf(cimg) !== -1);
        results.query.images.push(cimg);
        const pathImg = `${req.params.storeID}/products/${req.params.productID}/${cimg}`;
        imageToS3(req, pathImg, urlImg, null, global.imagesSizes, true, 'contain', cb);
      }, cb);
    }],
    deleteS3: ['query', (results, cb) => {
      // ordena imagenes sin borrar
      if (results.query) {
        results.query.images = _.union(body.images || [], results.query.images);
        delete body.images;
      }

      if (!results.query || !body.imagesDeleted) {
        return cb();
      }
      async.each(body.imagesDeleted, (i, cb) => {
        // busca en el query y borra
        const pos = results.query.images.indexOf(i);
        if (pos >= 0) {
          results.query.images.splice(pos, 1);
        }
        deleteS3(`tenancy/${req.tenancy}/ecommerce/${appCnf.s3.folder}/${req.params.storeID}/products/${req.params.productID}/${i}`, cb);
      }, cb);
    }],
    category: ['uploadFile', (_results, cb) => {
      if (!req.body.categoryID) {
        return cb();
      }
      query.up(req, [], req.body.categoryID._id || req.body.categoryID, cb);
    }],
    groups: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!body.groups || !_.isArray(body.groups)) {
        return cb();
      }
      const groupsF = body.groups;
      body.groups = [];
      async.eachLimit(groupsF, 5, (group, cb) => {
        let skus = group.sku.split(',').map((i) => _.trim(i));
        skus.push(results.query.sku);
        const skuF = [];
        const productIDs = [];
        skus = _.uniq(skus);
        async.eachLimit(skus, 5, (sku, cb) => {
          async.auto({
            product: (cb) => {
              models.Product
                .findOne({
                  tenancy: req.tenancy,
                  sku,
                  storeID: req.params.storeID,
                })
                .select('_id')
                .exec(cb);
            },
            add: ['product', (resultsInt, cb) => {
              if (resultsInt.product) {
                skuF.push(sku);
                productIDs.push(resultsInt.product._id);
              }
              cb();
            }],
          }, cb);
        }, (err) => {
          if (err) return cb(err);
          // almacena en todos los grupos
          body.groups.push({
            feature: group.feature,
            sku: skuF.join(','),
            productIDs,
          });
          cb();
        });
      }, cb);
    }],
    save: ['category', 'deleteS3', 'groups', (results, cb) => {
      if (results.category) {
        body.categoryIDs = _.map(results.category, (o) => o._id);
        body.categoryText = _.map(results.category, (o) => o.name);
      }
      body.storeText = results.store.name;
      results.query.set(body);
      if (results.query.publish) {
        checkProduct(results.store, results.query, cb);
      } else {
        results.query.save(cb);
      }
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(202).send(results.save);
  });
};
