const geolib = require('geolib');
const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    store: ['validate', (_results, cb) => {
      queryStore.storeBySlug(req, req.params.storeSlug, cb);
    }],
    selectMethods: ['store', (results, cb) => {
      let selectMethods = [];
      if (!results.store) {
        errors.push({ field: 'store', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (_.get(req, 'site.modules.deliveries')) {
        _.each(results.store.deliveries, (d) => {
          const dc = _.find(global.deliveries, { slug: d.slug });
          if (d.active && dc) {
            selectMethods.push({
              name: dc.name,
              slug: dc.slug,
              description: dc.description,
              price: d.value,
              virtualDelivery: dc.virtualDelivery,
              personalDelivery: dc.personalDelivery,
              payments: dc.payments,
            });
          }
        });
      } else {
        results.store.deliveries = _.clone(global.deliveriesMaster);
        _.each(results.store.deliveries, (o) => {
          o.price = _.get(req, 'site.modules.deliveryPrice');
        });
        if (_.get(req, 'site.modules.payments')) {
          _.each(results.store.deliveries, (o) => {
            o.payments = _.map(global.payments, (i) => i.slug);
          });
        }
        selectMethods = results.store.deliveries;
      }

      cb(null, selectMethods);
    }],
    coveragesAreas: ['store', (results, cb) => {
      queryStore.coveragesAreas(req, results.store._id, cb);
    }],
    inArea: ['coveragesAreas', (results, cb) => {
      if (!results.coveragesAreas.length || !req.body.location) {
        return cb(null, []);
      }
      async.mapLimit(results.coveragesAreas, 5, (area, cb) => {
        const inArea = geolib.isPointInPolygon(
          {
            latitude: _.get(req.body, 'location.lat'),
            longitude: _.get(req.body, 'location.lng'),
          },
          area.points.map((point) => ({
            latitude: point.lat,
            longitude: point.lng,
          })),
        );
        cb(null, { inArea, area });
      }, (_err, results) => {
        results = _.orderBy(results, ['area.price'], ['desc']);
        cb(null, _.find(results, { inArea: true }));
      });
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    // Precio de la zona
    _.set(_.find(results.selectMethods, { slug: 'transporte-local' }), 'price', _.get(results, 'inArea.area.price') || 0);
    res.send({
      shippingMethods: results.selectMethods,
      inArea: _.get(results, 'inArea.inArea') || false,
    });
  });
};
