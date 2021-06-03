function categoryTree(tenancy, categoryID, cb) {
  models.Category
    .find({
      tenancy,
      storeID: null,
      categoryID,
    })
    .select('_id name slugLong')
    .sort({
      name: 1,
    })
    .lean()
    .exec((err, docs) => {
      if (err) {
        cb(err);
      } else {
        async.mapLimit(docs, 20, (i, cb) => {
          categoryTree(tenancy, i._id, (_err, r) => {
            i.categories = r;
            cb(null, i);
          });
        }, (_err, docs) => {
          cb(null, docs);
        });
      }
    });
}

/**
 * Por cada consulta trae los datos del sitio
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  const tenancy = req.get('X-Tenancy') || 'santrato';
  async.parallel([
    // datos del site
    (cb) => {
      const key = `__tenancy:${req.tenancy}__site__`;
      req.tenancy = tenancy;
      client.get(key, (_err, reply) => {
        if (reply && process.env.NODE_ENV === 'production') {
          req.site = JSON.parse(reply);
          cb();
        } else {
          models.Site
            .findOne({
              tenancy,
            })
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
              req.site = doc;
              cb();
            });
        }
      });
    },
    // categorías
    (cb) => {
      const key = `__tenancy:${req.tenancy}__category_tree__`;
      req.tenancy = tenancy;
      client.get(key, (_err, reply) => {
        if (reply && process.env.NODE_ENV === 'production') {
          req.categories = JSON.parse(reply);
          cb();
        } else {
          categoryTree(tenancy, null, (err, docs) => {
            if (err) {
              return cb(err);
            }
            client.set(key, JSON.stringify(docs), 'EX', 3600);
            req.categories = docs;
            cb();
          });
        }
      });
    },

  ], next);
};
