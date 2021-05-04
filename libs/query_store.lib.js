exports.stores = (cb) => {
  const key = '__stores__';
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Store
        .find({ tenancy: req.tenancy, publish: true, approve: true })
        .lean()
        .exec((err, docs) => {
          if (err) {
            return cb(err);
          }
          client.set(key, JSON.stringify(docs), 'EX', 3600);
          cb(null, docs);
        });
    }
  });
};

exports.storesByPrimaryActivity = (primaryActivity, cb) => {
  const key = `__stores__primaryActivity__${primaryActivity}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Store
        .find({
          tenancy: req.tenancy, publish: true, approve: true, primaryActivity,
        })
        .lean()
        .exec((err, docs) => {
          if (err) {
            return cb(err);
          }
          client.set(key, JSON.stringify(docs), 'EX', 3600);
          cb(null, docs);
        });
    }
  });
};

exports.coveragesAreas = (storeID, cb) => {
  const key = `__coverages-areas__${storeID}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.CoverageArea
        .find({ tenancy: req.tenancy, active: true, storeID })
        .lean()
        .exec((err, docs) => {
          if (err) {
            return cb(err);
          }
          _.each(docs, (doc) => {
            doc.points = JSON.parse(doc.points || '[]');
          });
          client.set(key, JSON.stringify(docs), 'EX', 3600);
          cb(null, docs);
        });
    }
  });
};

exports.places = (storeID, cb) => {
  const key = `__places__${storeID}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Place
        .find({ tenancy: req.tenancy, active: true, storeID })
        .lean()
        .exec((err, docs) => {
          if (err) {
            return cb(err);
          }
          _.each(docs, (doc) => {
            doc.points = JSON.parse(doc.points || '[]');
          });
          client.set(key, JSON.stringify(docs), 'EX', 3600);
          cb(null, docs);
        });
    }
  });
};

exports.storeBySlug = (req, slug, cb) => {
  const key = `__store__${slug}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Store
        .findOne({
          tenancy: req.tenancy,
          slug,
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

exports.categoryByLongSlug = (storeID, slugLong, cb) => {
  const key = `__category__${storeID}__${slugLong}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Category
        .findOne({ tenancy: req.tenancy, storeID, slugLong })
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
