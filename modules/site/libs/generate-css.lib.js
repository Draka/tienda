const sass = require('node-sass');
const fs = require('fs');
const fse = require('fs-extra');
const modCnf = require('../modCnf');

module.exports = (req, cb) => {
  console.log('genera css');
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
    copyStyles: (cb) => {
      fse.copy('./modules/site/styles', `./tmp/${req.tenancy}`, cb);
    },
    query: ['validate', (_results, cb) => {
      models.Site
        .findOne({
          tenancy: req.tenancy,
          tenancy: req.tenancy,
        })
        .exec(cb);
    }],
    varsToSCSS: ['query', 'copyStyles', 'makedirLocal', (results, cb) => {
      if (!results.query) {
        errors.push({ field: 'site', msg: 'No se ha configurado el sitio' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      if (!_.trim(_.get(results.query, 'style.base'))) {
        results.query.style.base = JSON.stringify(modCnf.styleBase, null, 4);
      }
      let base = '';
      try {
        base = JSON.parse(_.get(results.query, 'style.base'));
      } catch (error) {
        base = modCnf.styleBase;
      }

      let lines = '';

      _.each(modCnf.styleBase, (values, field) => {
        values = base[field] || values;
        if (_.isPlainObject(values)) {
          lines += `$${field}: (\n`;
          _.each(values, (val, field) => {
            lines += `  "${field}": ${val},\n`;
          });
          lines += ');\n';
        } else {
          lines += `$${field}: ${values};\n`;
        }
      });
      fs.writeFile(`./tmp/${req.tenancy}/_system.scss`, lines, cb);
    }],
    css: ['varsToSCSS', (results, cb) => {
      sass.render({
        file: `./tmp/${req.tenancy}/style.scss`,
        outFile: toFile,
        // outputStyle: 'compressed',
      }, (err, result) => {
        if (err) {
          console.log(err);
          errors.push({ field: 'site', msg: 'Errores en la configuración del CSS' });
          return cb(listErrors(400, null, errors));
        }
        fs.writeFile(`${toFile}/style.min.css`, result.css, cb);
      });
    }],
    save: ['css', (results, cb) => {
      results.query.style.css = _.random(10000, 99999);
      results.query.save(cb);
    }],
  }, cb);
};
