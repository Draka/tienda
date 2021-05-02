exports.model = (model, id, cb) => {
  const name = _.kebabCase(_.deburr(model));
  const key = `__${name}__${id}`;
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
  const key = `__${req.tenancy}__${name}__${slug}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models[model]
        .findOne({ slug, tenancy: req.tenancy })
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

exports.modelAllPublish = (model, cb) => {
  const key = `__${models[model].collection.collectionName}__publish__`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models[model]
        .find({ publish: true })
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
/**
 * Datos del sitio
 * @param {*} cb
 */
exports.site = (cb) => {
  const key = '__site__';
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Site
        .findOne()
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          _.each(_.get(doc, 'images'), (image, path) => {
            _.each(image, (url, ext) => {
              doc.images[path][ext] = `${appCnf.url.cdn}tenancy/${req.tenancy}/images/${appCnf.s3.folder}/site/${path}/${url}`;
            });
          });
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

exports.store = (id, cb) => {
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

function categoryTree(storeID, categoryID, cb) {
  models.Category
    .find({
      storeID,
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
          categoryTree(storeID, i._id, (_err, r) => {
            i.categories = r;
            cb(null, i);
          });
        }, (_err, docs) => {
          cb(null, docs);
        });
      }
    });
}
exports.categoryTree = (storeID, cb) => {
  const key = `__category_tree__${storeID}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      categoryTree(storeID, null, (err, docs) => {
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

function up(arr, categoryID, cb) {
  models.Category
    .findOne({ _id: categoryID })
    .select('categoryID name')
    .lean()
    .exec((err, doc) => {
      if (err) {
        cb(err);
      } else if (doc) {
        arr.unshift({ _id: doc._id, name: doc.name });
        up(arr, doc.categoryID, cb);
      } else {
        cb(null, arr);
      }
    });
}

exports.up = up;
