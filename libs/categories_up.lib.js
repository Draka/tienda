function upByID(req, _id, cb) {
  models.Category
    .findOne({
      tenancy: req.tenancy,
      _id,
    })
    .exec((err, doc) => {
      if (!doc) {
        return cb(null, []);
      }
      let ldoc = [{ _id: doc._id, name: doc.name, slugLong: doc.slugLong }];
      upByID(req, doc.categoryID, (err, arr) => {
        ldoc = _.concat(arr, ldoc);
        cb(null, ldoc);
      });
    });
}

module.exports = (req, slugLong, cb) => {
  models.Category
    .findOne({
      tenancy: req.tenancy,
      slugLong,
    })
    .exec((err, doc) => {
      upByID(req, doc._id, cb);
    });
};
