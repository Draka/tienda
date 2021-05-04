function categoryTree(req, categoryID, cb) {
  models.Category
    .find({
      tenancy: req.tenancy,
      storeID: null,
      categoryID,
    })
    .select('_id name active')
    .sort({
      name: 1,
    })
    .lean()
    .exec((err, docs) => {
      if (err) {
        cb(err);
      } else {
        async.mapLimit(docs, 20, (i, cb) => {
          categoryTree(req, i._id, (_err, r) => {
            i.categories = r;
            cb(null, i);
          });
        }, (_err, docs) => {
          cb(null, docs);
        });
      }
    });
}
exports.categoryTree = (req, cb) => {
  const key = `__category_tree__tenancy__${req.tenancy}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      categoryTree(req, null, (err, docs) => {
        if (err) {
          return cb(err);
        }
        client.set(key, JSON.stringify(docs), 'EX', 3600);
        cb(null, docs);
      });
    }
  });
};

/**
 * Ordena la lista de categorias con padrre e hijos
 * @param {*} items
 * @param {*} arr
 * @param {*} depth
 */
function treePush(items, arr, depth = 0) {
  _.each(items, (i) => {
    i.name = _.repeat('--', depth) + i.name;
    arr.push(i);
    treePush(i.categories, arr, depth + 1);
    delete i.categories;
  });
}
exports.treePush = treePush;

function up(categoryID, cb) {
  models.Category
    .findOne({ _id: categoryID })
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
              tree({ tenancy: obj.tenancy, categoryID: doc._id }, cb);
            });
          });
        }, (err, docs) => {
          cb(null, docs);
        });
      }
    });
}

exports.tree = tree;
