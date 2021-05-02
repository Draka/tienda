/**
 * Por cada consulta trae los datos del sitio
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  const tenancy = req.get('X-Tenancy') || 'santrato';
  const key = `__site__${tenancy}__`;
  req.tenancy = tenancy;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      req.site = JSON.parse(reply);
      next();
    } else {
      models.Site
        .findOne({
          tenancy,
        })
        .lean()
        .exec((err, doc) => {
          if (err) {
            return next(err);
          }
          _.each(_.get(doc, 'images'), (image, path) => {
            _.each(image, (url, ext) => {
              doc.images[path][ext] = `${appCnf.url.cdn}tenancy/${req.tenancy}/images/${appCnf.s3.folder}/site/${path}/${url}`;
            });
          });
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          req.site = doc;
          next();
        });
    }
  });
};
