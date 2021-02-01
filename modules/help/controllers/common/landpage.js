const { api } = require('../../libs/api.lib');

module.exports = (req, res, next) => {
  async.auto({
    topics: (cb) => {
      api('categories', cb);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    const items = [];

    _.each(results.topics, (topic) => {
      if (!topic.categoryID) {
        topic.subs = [];
        items.push(topic);
      }
    });
    _.each(results.topics, (topic) => {
      const sub = _.find(items, { _id: topic.categoryID });
      if (sub) {
        sub.subs.push(topic);
      }
    });

    const breadcrumbs = [
      {
        link: '/',
        text: 'Inicio',
      },
      {
        link: '/ayuda',
        text: 'Centro de Ayuda',
        active: true,
      },
    ];

    const item = {
      seo: 'Centro de ayuda para instalar y configurar tu tienda online.',
    };

    console.log(items);

    res.render('../modules/help/views/common/landpage.pug', {
      session: req.user,
      item,
      items,
      categories: results.categories,
      title: 'Centro de Ayuda',
      breadcrumbs,
      js: 'page',
    });
  });
};
