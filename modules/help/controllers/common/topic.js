const { first } = require('lodash');
const { api } = require('../../libs/api.lib');

module.exports = (req, res, next) => {
  async.auto({
    items: (cb) => {
      api(`categories?slugLong=${req.params.slugLong}`, cb);
    },
    tree: (cb) => {
      api('tree', cb);
    },
    check: ['items', (results, cb) => {
      if (!results.items) {
        return cb(listErrors(404, null, [{ field: 'helpCategoryID', msg: 'No existe el Tópico' }]));
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
        link: '/ayuda',
        text: 'Centro de Ayuda',
      },
    ];

    const item = _.first(results.items);
    item.seo = item.description;

    res.render('../modules/help/views/common/topic.pug', {
      req,
      item,
      tree: results.tree,
      title: 'Centro de Ayuda',
      breadcrumbs,
      js: 'page',
      menu: req.params.slugLong,
    });
  });
};
