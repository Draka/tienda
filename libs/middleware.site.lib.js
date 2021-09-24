function categoryTree(tenancy, categoryID, cb) {
  async.auto({
    categoriesHeader: (cb) => {
      models.Category
        .find({
          tenancy,
          storeID: null,
          categoryID,
        })
        .select('name slugLong')
        .sort({
          name: 1,
        })
        .lean()
        .exec(cb);
    },
    categoriesHeaderCount: ['categoriesHeader', (results, cb) => {
      if (!results.categoriesHeader.length) {
        return cb(null, []);
      }
      models.Product
        .find({
          tenancy,
          categoryIDs: { $in: _.map(results.categoriesHeader, (c) => c._id) },
        })
        .select('categoryIDs')
        .lean()
        .exec(cb);
    }],
    categoriesHeaderAssign: ['categoriesHeaderCount', (results, cb) => {
      if (!results.categoriesHeader.length) {
        return cb();
      }
      const f = _.map(results.categoriesHeaderCount, (ch) => _.map(ch.categoryIDs, (chi) => chi.toString()));
      _.each(results.categoriesHeader, (c) => {
        const m = _.find(f, (fc) => fc.indexOf(c._id.toString()) >= 0);
        c.products = m ? m.length : 0;
      });
      cb();
    }],
  }, (err, results) => {
    const docs = results.categoriesHeader;
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

  // models.Category
  //   .find({
  //     tenancy,
  //     storeID: null,
  //     categoryID,
  //   })
  //   .select('_id name slugLong')
  //   .sort({
  //     name: 1,
  //   })
  //   .lean()
  //   .exec((err, docs) => {
  //     if (err) {
  //       cb(err);
  //     } else {
  //       async.mapLimit(docs, 20, (i, cb) => {
  //         categoryTree(tenancy, i._id, (_err, r) => {
  //           i.categories = r;
  //           cb(null, i);
  //         });
  //       }, (_err, docs) => {
  //         cb(null, docs);
  //       });
  //     }
  //   });
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
