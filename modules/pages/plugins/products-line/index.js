/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');

module.exports = (req, obj, cb) => {
  if (/\[products-line-history"\]/.test(obj.text)) {
    const re = new RegExp('\\[products-line-history\\]', 'igm');
    const matchAll = obj.text.matchAll(re);
    const matchs = [];
    for (const match of matchAll) {
      matchs.push(match);
    }
    async.eachLimit(matchs, 5, (match, cb) => {
      const data = (match[1] || '').split(',');
      const slug = data[0];
      const limit = Math.max(parseInt(data[1], 10), 1) || 12;

      async.auto({
        items: (cb) => {
          models.Product
            .find({
              publish: true,
            })
            .limit(limit)
            .populate({
              path: 'storeID',
              select: 'name slug approve publish',
            })
            .lean()
            .exec(cb);
        },
        postFindProduct: ['items', (results, cb) => {
          _.each(results.items, (item) => {
            const store = item.storeID;
            item.imagesSizes = _.map(item.images, (i) => {
              const sizes = {};
              const pathImg = `tenancy/${req.tenancy}/ecommerce/${appCnf.s3.folder}/${store._id}/products/${item._id}/${i}`;

              _.each(global.imagesSizes, (is) => {
                sizes[`${is.x}x${is.y}_jpg`] = `${appCnf.url.cdn}${pathImg}/${is.x}x${is.y}.jpg`;
              });

              _.each(global.imagesSizes, (is) => {
                sizes[`${is.x}x${is.y}_webp`] = `${appCnf.url.cdn}${pathImg}/${is.x}x${is.y}.webp`;
              });
              sizes.original = `${appCnf.url.cdn}${pathImg}/original.jpg`;
              return sizes;
            });
          });
          cb(null, []);
        }],
      }, (err, results) => {
        obj.text = obj.text.replace(match[0], template({
          req,
          items: results.items,
          slug,
        }, 'products'));
        cb(err);
      });
    }, cb);
  } else {
    cb();
  }
};
