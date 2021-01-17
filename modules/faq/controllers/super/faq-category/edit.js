module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.FaqCategory
        .findById(req.params.faqCategoryID)
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'faqCategoryID', msg: 'No existe la Categoría' }]));
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
        link: '/administracion/super/faq-categorias',
        text: 'FAQ Categorías',
      },
      {
        link: `/administracion/super/faq-categorias/${req.params.faqCategoryID}/editar`,
        text: `Editar - ${results.item.name}`,
        active: true,
      },
    ];

    res.render('../modules/faq/views/super/faq-categorias/edit.pug', {
      session: req.user,
      item: results.item,
      title: 'Editar FAQ Categoría',
      menu: 'super-faq-categorias',
      breadcrumbs,
      js: 'admin',
    });
  });
};
