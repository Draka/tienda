exports.model = (req, model, id, cb) => {
  const name = _.kebabCase(_.deburr(model));
  const key = `__${name}__tenancy:${req.tenancy}_${id}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models[model]
        .findById(id)
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

exports.modelSlug = (req, model, slug, cb) => {
  const name = _.kebabCase(_.deburr(model));
  slug = _.kebabCase(_.deburr(slug));
  const key = `__${name}__tenancy:${req.tenancy}_${slug}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models[model]
        .findOne({ tenancy: req.tenancy, slug })
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

exports.xxxxxxxmodelAllPublish = (req, model, cb) => {
  const key = `__${models[model].collection.collectionName}__tenancy:${req.tenancy}_publish__`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models[model]
        .find({ tenancy: req.tenancy, publish: true })
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

exports.modelAll = (model, cb) => {
  const key = `__${models[model].collection.collectionName}__`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models[model]
        .find()
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

exports.user = (id, cb) => {
  const key = `__user__${id}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.User
        .findById(id)
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

exports.xxxxxxstore = (id, cb) => {
  const key = `__store__${id}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Store
        .findById(id)
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

exports.place = (id, cb) => {
  const key = `__place__${id}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Place
        .findById(id)
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
exports.categoryTreeTenancy = (req, cb) => {
  const key = `__tenancy:${req.tenancy}__category_tree__`;
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

function treePush(items, arr, depth = 0) {
  _.each(items, (i) => {
    i.name = _.repeat('--', depth) + i.name;
    arr.push(i);
    treePush(i.categories, arr, depth + 1);
    delete i.categories;
  });
}
exports.treePush = treePush;

function up(req, arr, categoryID, cb) {
  models.Category
    .findOne({ tenancy: req.tenancy, _id: categoryID })
    .select('categoryID name')
    .lean()
    .exec((err, doc) => {
      if (err) {
        cb(err);
      } else if (doc) {
        arr.unshift({ _id: doc._id, name: doc.name });
        up(req, arr, doc.categoryID, cb);
      } else {
        cb(null, arr);
      }
    });
}

exports.up = up;
