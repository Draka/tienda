const { putS3Path } = require('./put_s3_path.lib');
const { productBySKU } = require('./query_product.lib');
const { isAvailable, setPrice } = require('./util.lib');

/**
 *
 * @param {*} results {store: Object, place: Object}
 * @param {*} bodyItems Array<Object> | Object
 * @param {*} cb Function(err, data)
 */
module.exports = (req, store, bodyItems, cb) => {
  const items = {};
  const noActives = [];
  const changePrice = [];
  async.each(bodyItems, (item, cb) => {
    async.auto({
      // Buscaa el producto
      product: (cb) => {
        if (!store) {
          return cb();
        }
        productBySKU(req, store._id, item.sku, (err, doc) => {
          if (err) {
            return cb(err);
          }
          if (!doc || doc.price <= 0 || !doc.publish || (doc.inventory && doc.stock <= 0) || !isAvailable(doc) || !item.quantity) {
            delete items[item.sku];
            noActives.push(item);
            return cb();
          }
          setPrice(doc);
          if (item.price !== doc.price) {
            changePrice.push(item);
          }
          doc.quantity = item.quantity;
          cb(null, doc);
        });
      },
      postFind: ['product', (results, cb) => {
        if (!results.product) {
          return cb();
        }
        putS3Path(req, [results.product], store);
        results.product.store = store.slug;

        items[results.product.sku] = _.pick(
          results.product,
          [
            'brandText',
            'categoryText',
            'imagesSizes',
            'name',
            'price',
            'quantity',
            'sku',
            'store',
            'digital',
          ],
        );
        cb();
      }],
    }, cb);
  }, (err) => {
    if (err) {
      return cb(err);
    }
    cb(null, { items, noActives, changePrice });
  });
};
