function upByID(_id, cb) {
  models.Category
    .findOne({ _id })
    .exec((err, doc) => {
      if (!doc) {
        return cb(null, []);
      }
      let ldoc = [{ _id: doc._id, name: doc.name, slugLong: doc.slugLong }];
      upByID(doc.categoryID, (err, arr) => {
        ldoc = _.concat(arr, ldoc);
        cb(null, ldoc);
      });
    });
}

module.exports = (slugLong, cb) => {
  models.Category
    .findOne({ slugLong })
    .exec((err, doc) => {
      upByID(doc._id, cb);
    });
};
