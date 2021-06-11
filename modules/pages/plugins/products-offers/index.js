/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');
const { putS3Path } = require('../../../../libs/put_s3_path.lib');
const { isAvailable } = require('../../../../libs/util.lib');

module.exports = (req, obj, cb) => {
  if (/\[products-offers\]/.test(obj.text)) {
    const re = new RegExp('\\[products-offers\\]', 'igm');
    const matchAll = obj.text.matchAll(re);
    const matchs = [];
    for (const match of matchAll) {
      matchs.push(match);
    }
    async.eachLimit(matchs, 5, (match, cb) => {
      async.auto({
        validate: (cb) => {
          cb();
        },
        products: ['validate', (results, cb) => {
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
          };
          models.Product
            .find(query)
            .sort({
              'offer.available.end': -1,
            })
            .populate({
              path: 'storeID',
              select: 'name slug approve publish',
            })
            .lean()
            .limit(5)
            .exec(cb);
        }],
        postFindProducts: ['products', (results, cb) => {
          putS3Path(req, results.products);
          _.each(results.products, (product) => {
            product.isAvailable = isAvailable(product);
          });
          cb();
        }],
      }, (err, results) => {
        if (results.products.length && results.products.length < 5) {
          for (let index = results.products.length; index < 5; index++) {
            results.products.push(null);
          }
        }
        obj.text = obj.text.replace(match[0], template({
          req,
          xofferts: results.products,
        }, 'products-offers'));
        cb(err);
      });
    }, cb);
  } else {
    cb();
  }
};
