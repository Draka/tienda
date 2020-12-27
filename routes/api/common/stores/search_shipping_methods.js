const geolib = require('geolib');
const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  async.auto({
    validate: (cb) => {
      cb();
    },
    store: ['validate', (_results, cb) => {
      queryStore.storeBySlug(req.params.storeSlug, cb);
    }],
    selectMethods: ['store', (results, cb) => {
      const selectMethods = [];
      if (!results.store) {
        errors.push({ field: 'store', msg: 'No existe la tienda.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
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
      cb(null, selectMethods);
    }],
    coveragesAreas: ['store', (results, cb) => {
      queryStore.coveragesAreas(results.store._id, cb);
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
        cb(null, inArea);
      }, (_err, results) => {
        cb(null, results.lastIndexOf(true) >= 0);
      });
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send({
      shippingMethods: results.selectMethods,
      inArea: results.inArea,
    });
  });
};
