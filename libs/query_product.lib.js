/* eslint-disable max-len */
exports.productBySKU = (storeID, sku, cb) => {
  const key = `__product__${storeID}__${sku}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Product
        .findOne({ storeID, sku, delete: false })
        .select('digital.is available publish price inventory stock imagesURLs images imagesSizes categoryText featured name sku slug brandText shortDescription longDescription features storeID groups')
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          cb(null, doc);
        });
    }
  });
};
