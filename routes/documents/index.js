/* eslint-disable global-require */
const queryDocument = require('../../libs/query_document.lib');

module.exports = (app) => {
  app.get('/documentos/:documentSlug', (req, res, next) => {
    async.auto({
      item: (cb) => {
        queryDocument.documentBySlug(req, req.params.documentSlug, cb);
      },
      check: ['item', (results, cb) => {
        if (!results.item) {
          return cb(listErrors(404, null, [{ field: 'documentID', msg: 'El registro no existe.' }]));
        }
        cb();
      }],
    }, (err, results) => {
      if (err) {
        return next(err);
      }
      const breadcrumbs = [
        {
          link: '/',
          text: 'Inicio',
        },
        {
          link: `/documentos/${results.item.slug}`,
          text: results.item.title,
          active: true,
        },
      ];

      res.render('pages/documents/view.pug', {
        session: req.user,
        item: results.item,
        title: results.item.title,
        breadcrumbs,
        js: 'page',
      });
    });
  });
};
