/* eslint-disable max-len */
exports.productBySKU = (req, storeID, sku, cb) => {
  const key = `__tenancy:${req.tenancy}__product__${storeID}__${sku}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Product
        .findOne({ storeID, sku, delete: false })
        .populate({
          path: 'categoryIDs',
          select: 'name slugLong',
        })
        .populate({
          path: 'groups.productIDs',
          select: 'name sku features',
        })
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
