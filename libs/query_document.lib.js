/* eslint-disable max-len */
exports.documentBySlug = (slug, cb) => {
  const key = `__document__${slug}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Document
        .findOne({ tenancy: req.tenancy, slug, publish: true })
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
