exports.checkStore = (store, cb) => {
  if (!store) {
    return cb();
  }
  async.auto({
    imageLogo: (cb) => {
      if (_.get(store, 'images.logo')) {
        _.set(store, 'problems.imageLogo.problem', false);
      } else {
        _.set(store, 'problems.imageLogo.problem', true);
      }
      cb();
    },
    seo: (cb) => {
      const l = (store.seo || '').length;
      if (l < 150 || l > 180) {
        _.set(store, 'problems.seo.alert', true);
      } else {
        _.set(store, 'problems.seo.alert', false);
      }
      cb();
    },
    coveragesAreas: (cb) => {
      models.CoverageArea
        .countDocuments({
          storeID: store._id,
        })
        .exec(cb);
    },
    deliveries: ['coveragesAreas', (results, cb) => {
      _.set(store, 'problems.coveragesAreas.problem', false);
      _.set(store, 'problems.localDelivery.problem', false);
      _.set(store, 'problems.deliveries.problem', false);
      _.set(store, 'problems.deliveries.alert', false);
      // Vitrina
      if (store.showcase) {
        // mira algun método de enrega
        _.each(store.deliveries, (delivery) => {
          if (delivery.slug === 'transporte-local') {
            // debe estar activo
            if (!delivery.active) {
              _.set(store, 'problems.localDelivery.problem', true);
            }
            // si un metodo activo vale más de 15.000
            if (delivery.value > 15000) {
              _.set(store, 'problems.deliveries.alert', true);
            }
            // si tienen transporte local pero no zona de cobertura
            if (!results.coveragesAreas) {
              _.set(store, 'problems.coveragesAreas.problem', true);
            }
          }
        });
        return cb();
      }
      // Cuando no es vitrina
      let some = false;
      // mira algun método de enrega
      _.each(store.deliveries, (delivery) => {
        if (delivery.active) {
          // debe haber un metodo de entrega
          some = true;
          // si un metodo activo vale más de 15.000
          if (delivery.value > 15000) {
            _.set(store, 'problems.deliveries.alert', true);
          }
          // si tienen transporte local pero no zona de cobertura
          if (delivery.slug === 'transporte-local' && !results.coveragesAreas) {
            _.set(store, 'problems.coveragesAreas.problem', true);
          }
        }
      });
      if (!some) {
        _.set(store, 'problems.deliveries.problem', true);
      }
      cb();
    }],
    payments: ['deliveries', (results, cb) => {
      _.set(store, 'problems.payments.problem', false);
      _.set(store, 'problems.localPayment.problem', false);
      if (store.showcase) {
        // mira algun método de enrega
        _.each(store.payments, (payment) => {
          if (payment.slug === 'contra-entrega') {
            // debe estar activo
            if (!payment.active) {
              _.set(store, 'problems.localPayment.problem', true);
            }
            // si tienen transporte local pero no zona de cobertura
            if (!results.coveragesAreas) {
              _.set(store, 'problems.coveragesAreas.problem', true);
            }
          }
        });
        return cb();
      }
      // Cuando no es vitrina
      let some = false;
      // mira algun método de enrega
      _.each(store.payments, (payment) => {
        if (payment.active) {
          // debe haber un metodo de entrega
          some = true;
          // si tienen transporte local pero no zona de cobertura
          if (payment.slug === 'contra-entrega' && !results.coveragesAreas) {
            _.set(store, 'problems.coveragesAreas.problem', true);
          }
        }
      });
      if (!some) {
        _.set(store, 'problems.payments.problem', true);
      }
      cb();
    }],
    categories: (cb) => {
      models.Category
        .countDocuments({
          storeID: store._id,
        })
        .exec(cb);
    },
    categoriesCheck: ['categories', (results, cb) => {
      if (results.categories) {
        _.set(store, 'problems.categories.problem', false);
      } else {
        _.set(store, 'problems.categories.problem', true);
      }
      cb();
    }],
    products: (cb) => {
      models.Product
        .countDocuments({
          storeID: store._id,
          publish: true,
        })
        .exec(cb);
    },
    productsCheck: ['products', (results, cb) => {
      if (results.products) {
        _.set(store, 'problems.products.problem', false);
      } else {
        _.set(store, 'problems.products.problem', true);
      }
      cb();
    }],
    productsImage: (cb) => {
      models.Product
        .countDocuments({
          storeID: store._id,
          publish: true,
          'problems.images.alert': true,
        })
        .exec(cb);
    },
    productsImageCheck: ['productsImage', (results, cb) => {
      if (results.productsImage) {
        _.set(store, 'problems.productsImage.alert', true);
      } else {
        _.set(store, 'problems.productsImage.alert', false);
      }
      cb();
    }],
    productsDelivery: (cb) => {
      models.Product
        .countDocuments({
          storeID: store._id,
          $or: [
            { 'problems.digital.problem': true },
            { 'problems.dimensions.problem': true },
          ],
        })
        .exec(cb);
    },
    productsDeliveryCheck: ['productsDelivery', (results, cb) => {
      if (results.productsDelivery) {
        _.set(store, 'problems.productsDelivery.alert', true);
      } else {
        _.set(store, 'problems.productsDelivery.alert', false);
      }
      cb();
    }],

  }, (err) => {
    if (err) {
      return cb(err);
    }
    store.save(cb);
  });
};

exports.checkProduct = (store, product, cb) => {
  if (!store || !product) {
    return cb();
  }
  async.auto({
    images: (cb) => {
      if (product.images.length) {
        _.set(product, 'problems.images.alert', false);
      } else {
        _.set(product, 'problems.images.alert', true);
      }
      cb();
    },
    deliveries: (cb) => {
      _.set(product, 'problems.digital.problem', false);
      _.set(product, 'problems.dimensions.problem', false);
      if (store.showcase) {
        return cb();
      }
      _.each(store.deliveries, (delivery) => {
        if (delivery.slug === 'virtual-product') {
          if (product.digital.is && !delivery.active) {
            _.set(product, 'problems.digital.problem', true);
          }
        }
        if (delivery.slug === 'encomienda-nacional' || delivery.slug === 'encomienda-local') {
          if (delivery.active && (!product.weight || !product.length || !product.height || !product.width)) {
            _.set(product, 'problems.dimensions.problem', true);
          }
        }
      });
      cb();
    },

  }, (err) => {
    if (err) {
      return cb(err);
    }
    product.save(cb);
  });
};
