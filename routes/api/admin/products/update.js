const { isArray } = require('lodash');
const { imageToS3 } = require('../../../../libs/image.lib');
const { deleteS3 } = require('../../../../libs/delete_s3.lib');
const query = require('../../../../libs/query.lib');

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
  ]);
  if (typeof req.body.publish !== 'undefined' && !body.publish) {
    body.publish = false;
  }
  if (body.digital && typeof body.digital.is !== 'undefined' && !body.digital.is) {
    _.set(body, 'digital.is', false);
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
      cb();
    },
    store: ['validate', (_results, cb) => {
      models.Store
        .findOne({ _id: req.params.storeID, userID: req.user._id })
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
        .findById(req.params.productID)
        .exec(cb);
    }],
    uploadFile: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'store', msg: 'No existe el producto.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!req.files) {
        return cb();
      }
      if (!isArray(req.files.images)) {
        req.files.images = [req.files.images];
      }

      async.eachLimit(req.files.images, 10, (image, cb) => {
        let cimg;
        do {
          cimg = _.random(10000, 99999);
        } while (results.query.images.indexOf(cimg) !== -1);
        results.query.images.push(cimg);
        const pathImg = `ecommerce/${req.params.storeID}/products/${req.params.productID}/${cimg}`;
        imageToS3(pathImg, null, image, global.imagesSizes, true, cb);
      }, cb);
    }],
    deleteS3: ['query', (results, cb) => {
      if (!results.query || !body.imagesDeleted) {
        return cb();
      }
      async.each(body.imagesDeleted, (i, cb) => {
        // busca en el query y borra
        const pos = results.query.images.indexOf(i);
        if (pos >= 0) {
          results.query.images.splice(pos, 1);
        }
        deleteS3(`ecommerce/${req.params.storeID}/products/${req.params.productID}/${i}`, cb);
      }, cb);
    }],
    category: ['uploadFile', (_results, cb) => {
      if (!req.body.categoryID) {
        return cb();
      }
      query.up([], req.body.categoryID._id || req.body.categoryID, cb);
    }],
    save: ['category', 'deleteS3', (results, cb) => {
      if (results.category) {
        body.categoryIDs = _.map(results.category, (o) => o._id);
        body.categoryText = _.map(results.category, (o) => o.name);
      }
      results.query.set(body).save(cb);
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
