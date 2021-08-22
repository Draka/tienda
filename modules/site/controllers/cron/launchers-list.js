module.exports = (req, res, next) => {
  const start = moment.tz(global.tz).startOf('day').subtract('week', 1);
  const end = moment.tz(global.tz);// .startOf('day');

  async.auto({
    // Nuevos
    newProducts: (cb) => {
      models.Product
        .aggregate([
          {
            $match: {
              publish: true,
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
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: { $first: '$categoryIDs' },
              productID: { $first: '$_id' },
            },
          },

        ])
        .exec(cb);
    },
    newProductsReset: ['newProducts', (results, cb) => {
      models.ProductList
        .updateMany({
          slug: 'launcher-new-products',
          last: true,
        },
        { last: false }, cb);
    }],
    newProductsPost: ['newProductsReset', (results, cb) => {
      _.each(results.newProducts, (doc, i) => {
        models.ProductList({
          tenancy: req.tenancy,
          slug: 'launcher-new-products',
          last: true,
          date: `${end.format('YYYY-MM-DD')}`,
          dateStart: start.toDate(),
          dateEnd: end.toDate(),
          order: i,
          productID: doc.productID,
        }).save();
      });
      cb();
    }],
    // Ofertas
    newOffers: (cb) => {
      models.Product
        .aggregate([
          {
            $match: {
              publish: true,
              'offer.percentage': { $gt: 0 },
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
            },
          },
          {
            $group: {
              _id: { $first: '$categoryIDs' },
              productID: { $first: '$_id' },
            },
          },
          { $sample: { size: 4 } },
        ])
        .exec(cb);
    },
    newOffersReset: ['newOffers', (results, cb) => {
      models.ProductList
        .updateMany({
          slug: 'launcher-new-offers',
          last: true,
        },
        { last: false }, cb);
    }],
    newOffersPost: ['newOffersReset', (results, cb) => {
      _.each(results.newOffers, (doc, i) => {
        models.ProductList({
          tenancy: req.tenancy,
          slug: 'launcher-new-offers',
          last: true,
          date: `${end.format('YYYY-MM-DD')}`,
          dateStart: start.toDate(),
          dateEnd: end.toDate(),
          order: i,
          productID: doc.productID,
        }).save();
      });
      cb();
    }],
    // Favoritos
    newFavorites: (cb) => {
      models.Product
        .aggregate([
          {
            $match: {
              publish: true,
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
            },
          },
          {
            $group: {
              _id: { $first: '$categoryIDs' },
              productID: { $first: '$_id' },
            },
          },
          { $sample: { size: 4 } },
        ])
        .exec(cb);
    },
    newFavoritesReset: ['newFavorites', (results, cb) => {
      models.ProductList
        .updateMany({
          slug: 'launcher-favorites',
          last: true,
        },
        { last: false }, cb);
    }],
    newFavoritesPost: ['newFavoritesReset', (results, cb) => {
      _.each(results.newFavorites, (doc, i) => {
        models.ProductList({
          tenancy: req.tenancy,
          slug: 'launcher-favorites',
          last: true,
          date: `${end.format('YYYY-MM-DD')}`,
          dateStart: start.toDate(),
          dateEnd: end.toDate(),
          order: i,
          productID: doc.productID,
        }).save();
      });
      cb();
    }],
    // Destacados
    newFeatures: (cb) => {
      models.Product
        .aggregate([
          {
            $match: {
              publish: true,
              featured: true,
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
            },
          },
          {
            $group: {
              _id: { $first: '$categoryIDs' },
              productID: { $first: '$_id' },
            },
          },
          { $sample: { size: 4 } },
        ])
        .exec(cb);
    },
    newFeaturesReset: ['newFeatures', (results, cb) => {
      models.ProductList
        .updateMany({
          slug: 'launcher-features',
          last: true,
        },
        { last: false }, cb);
    }],
    newFeaturesPost: ['newFeaturesReset', (results, cb) => {
      _.each(results.newFeatures, (doc, i) => {
        models.ProductList({
          tenancy: req.tenancy,
          slug: 'launcher-features',
          last: true,
          date: `${end.format('YYYY-MM-DD')}`,
          dateStart: start.toDate(),
          dateEnd: end.toDate(),
          order: i,
          productID: doc.productID,
        }).save();
      });
      cb();
    }],
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ ok: true });
  });
};
