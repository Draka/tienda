/* eslint-disable no-restricted-syntax */
const { template } = require('../../libs/util.lib');

module.exports = (req, obj, cb) => {
  if (/\[slider-launchers slug="([a-z0-9-, ]*)"\]/.test(obj.text)) {
    const re = new RegExp('\\[slider-launchers slug="([a-z0-9-, ]*)"\\]', 'igm');
    const matchAll = obj.text.matchAll(re);
    const matchs = [];
    for (const match of matchAll) {
      matchs.push(match);
    }
    async.eachLimit(matchs, 5, (match, cb) => {
      const data = (match[1] || '').split(',');
      const slug = data[0];
      const limit = Math.max(parseInt(data[1], 10), 1) || 4;

      async.auto({
        items: (cb) => {
          models.ProductList
            .find({
              slug,
              last: true,
            })
            .sort({
              createdAt: -1,
            })
            .limit(limit)
            .populate({
              path: 'productID',
              populate: {
                path: 'categoryIDs',
                select: 'slugLong',
              },
            })
            .lean()
            .exec(cb);
        },
        postFindProduct: ['items', (results, cb) => {
          _.each(results.items, (item) => {
            const store = item.productID.storeID;
            item.productID.imagesSizes = _.map(item.productID.images, (i) => {
              const sizes = {};
              const pathImg = `tenancy/${req.tenancy}/ecommerce/${appCnf.s3.folder}/${store._id}/products/${item.productID._id}/${i}`;

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
        let url = '';
        if (slug === 'launcher-new-offers') {
          url = 'ofertas';
        } else if (slug === 'launcher-new-products') {
          url = 'nuevos';
        } else if (slug === 'launcher-favorites') {
          url = 'favoritos';
        } else if (slug === 'launcher-features') {
          url = 'destacados';
        }
        const l = results.items.length;
        for (let i = l; i < 4; i++) {
          results.items.push(_.first(results.items));
        }
        obj.text = obj.text.replace(match[0], template({
          req,
          items: results.items,
          slug,
          url,
        }, 'slider-launchers'));
        cb(err);
      });
    }, cb);
  } else {
    cb();
  }
};
