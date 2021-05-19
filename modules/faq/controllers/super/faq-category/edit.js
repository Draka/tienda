module.exports = (req, res, next) => {
  async.auto({
    item: (cb) => {
      models.FaqCategory
        .findOne({
          tenancy: req.tenancy,
          _id: req.params.faqCategoryID,
        })
        .exec(cb);
    },
    check: ['item', (results, cb) => {
      if (!results.item) {
        return cb(listErrors(404, null, [{ field: 'faqCategoryID', msg: 'El registro no existe.' }]));
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
      req,
      item: results.item,
      title: 'Editar FAQ Categoría',
      menu: 'super-faq-categorias',
      breadcrumbs,
      js: 'admin',
    });
  });
};
