module.exports = (req, res, next) => {
  // Salta a otra url
  const query = {};
  if (req.query.dateStart) {
    _.set(query, 'createdAt.$gte', moment.tz(req.query.dateStart, global.tz).startOf('day').toDate());
  }
  if (req.query.dateEnd) {
    _.set(query, 'createdAt.$lte', moment.tz(req.query.dateEnd, global.tz).endOf('day').toDate());
  }
  async.auto({
    countUsers: (cb) => {
      const queryC = _.clone(query);
      models.User
        .countDocuments(queryC)
        .exec(cb);
    },
    countStores: (cb) => {
      const queryC = _.clone(query);
      models.Store
        .countDocuments(queryC)
        .exec(cb);
    },
    countStoresPublish: (cb) => {
      const queryC = _.clone(query);
      queryC.publish = true;
      models.Store
        .countDocuments(queryC)
        .exec(cb);
    },
    countProducts: (cb) => {
      const queryC = _.clone(query);
      models.Product
        .countDocuments(queryC)
        .exec(cb);
    },
    countProductsPublish: (cb) => {
      const queryC = _.clone(query);
      queryC.publish = true;
      models.Product
        .countDocuments(queryC)
        .exec(cb);
    },
    countOrders: (cb) => {
      const queryC = _.clone(query);
      queryC.status = { $in: ['paid', 'picking', 'ready', 'onway', 'arrived', 'missing', 'completed'] };
      models.Order
        .countDocuments(queryC)
        .exec(cb);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/super/reportes',
        text: 'Reportes',
        active: true,
      },
    ];

    res.render('../modules/reports/views/super/search.pug', {
      req,
      results,
      title: 'Reportes',
      menu: 'super-reportes',
      breadcrumbs,
    });
  });
};
