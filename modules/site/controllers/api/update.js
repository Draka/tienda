const modCnf = require('../../modCnf');
const { imageToS3 } = require('../../libs/image.lib');
const generateCSS = require('../../libs/generate-css.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const fbody = {};
  _.each(req.body, (v, k) => {
    _.set(fbody, k, v);
  });

  const body = _.pick(fbody, [
    'site',
    'name',
    'title',
    'description',
    'url',
    'email',
    'contacts',
    'images',
    'sameAs',
    'style',
    'modules',
  ]);
  body.tenancy = req.tenancy;

  if (body.contacts) {
    body.contacts = _.map(global.socialMedia, (contact) => {
      const d = _.find(body.contacts, { slug: contact[0] });
      if (contact[3].cellphone) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

        if (d.value && !re.test(d.value)) {
          errors.push({ field: 'cellphone', msg: __('Debe escribir un número de célular válido') });
        }
        if (d.value.length === 10) {
          d.value = `+57${d.value}`;
        }
        if (d.value.length === 12) {
          d.value = `+${d.value}`;
        }
      }
      return {
        slug: contact[0],
        value: _.get(d, 'value') || '',
      };
    });
  }
  async.auto({
    validate: (cb) => {
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    query: ['validate', (_results, cb) => {
      models.Site
        .findOne({
          tenancy: req.tenancy,
        })
        .exec(cb);
    }],
    uploadFile: ['query', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'sites', msg: 'El registro no existe.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!req.files) {
        return cb();
      }
      async.eachOfLimit(req.files, 5, (file, key, cb) => {
        if (modCnf.images[key]) {
          if (modCnf.images[key].mimetype.indexOf(file.mimetype) === -1) {
            return cb();
          }

          const cimg = _.random(10000, 99999);
          const originalExt = _.last(file.name.split('.'));
          if (modCnf.images[key].convert.length) {
            _.each(modCnf.images[key].convert, (ext) => {
              _.set(results.query, `images.${key}.${ext}`, `${key}.${ext}?=${cimg}`);
            });
          } else {
            _.set(results.query, `images.${key}.${modCnf.images[key].ext}`, `${key}.${originalExt}?=${cimg}`);
          }
          const pathImg = `site/${key}`;
          imageToS3(req, pathImg, key, file, modCnf.images[key].convert, cb);
        } else {
          return cb();
        }
      }, cb);
    }],
    save: ['uploadFile', (results, cb) => {
      results.query.set(body).save(cb);
    }],
    generateCSS: ['save', (results, cb) => {
      if (_.get(body, 'style.base')) {
        generateCSS(req, cb);
      } else {
        cb();
      }
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (req.body.redirect) {
      return res.redirect(req.body.redirect);
    }
    res.status(201).send(results.save);
  });
};
