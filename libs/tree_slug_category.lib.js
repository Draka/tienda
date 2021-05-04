function up(categoryID, cb) {
  models.Category
    .findOne({ tenancy: req.tenancy, _id: categoryID })
    .select('slugLong')
    .exec((err, doc) => {
      if (err) {
        cb(err);
      } else if (doc) {
        cb(null, `${doc.slugLong}-`);
      } else {
        cb(null, '');
      }
    });
}

function tree(obj, cb) {
  models.Category
    .find(obj)
    .select('categoryID slug')
    .exec((err, docs) => {
      if (err) {
        cb(err);
      } else {
        async.mapLimit(docs, 1, (doc, cb) => {
          up(doc.categoryID, (err, str) => {
            doc.slugLong = `${str}${doc.slug}`;
            doc.save(() => {
              tree({ storeID: obj.storeID, categoryID: doc._id }, cb);
            });
          });
        }, (err, docs) => {
          cb(null, docs);
        });
      }
    });
}

module.exports = tree;
