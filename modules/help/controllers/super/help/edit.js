const { modelAll } = require('../../../../../libs/query.lib');

module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.Help
        .findById(req.params.helpID)
        .exec(cb);
    },
    categories: ['item', (_results, cb) => {
      modelAll('HelpCategory', cb);
    }],
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'helpID', msg: 'No existe la Pregunta' }]));
      }
      cb();
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const breadcrumbs = [
      {
        link: '/administracion',
        text: 'Administración',
      },
      {
        link: '/administracion/super/ayuda',
        text: 'Ayuda',
      },
      {
        link: `/administracion/super/ayuda/${req.params.helpID}/editar`,
        text: `Editar - ${results.item.question}`,
        active: true,
      },
    ];

    res.render('../modules/help/views/super/help/edit.pug', {
      session: req.user,
      item: results.item,
      categories: results.categories,
      title: 'Editar Ayuda',
      menu: 'super-help',
      breadcrumbs,
      cke: true,
      js: 'admin',
    });
  });
};
