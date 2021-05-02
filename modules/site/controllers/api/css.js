const sass = require('node-sass');
const fs = require('fs');

module.exports = (req, res, next) => {
  const errors = [];
  const toFile = `./public/tenancy/${req.tenancy}/css`;
  async.auto({
    validate: (cb) => {
      cb();
    },
    makedirLocal: (cb) => {
      if (!fs.existsSync(toFile)) {
        fs.mkdir(toFile, { recursive: true }, cb);
      } else {
        cb();
      }
    },
    query: ['validate', (_results, cb) => {
      models.Site
        .findOne({
          tenancy: req.tenancy,
        })
        .exec(cb);
    }],
    css: ['query', 'makedirLocal', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'site', msg: 'No se ha configurado el sitio' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      sass.render({
        file: './modules/site/styles/style.scss',
        outFile: toFile,
        outputStyle: 'compressed',
      }, (err, result) => {
        fs.writeFile(`${toFile}/style.min.css`, result.css, cb);
      });
    }],
    save: ['css', (results, cb) => {
      results.query.set({
        'style.css': _.random(10000, 99999),
      }).save(cb);
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
