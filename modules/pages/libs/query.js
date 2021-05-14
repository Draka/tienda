const https = require('https');

exports.faqByCategoryID = (req, categoryID, cb) => {
  const key = `__tenancy:${req.tenancy}__faqs__categoryID__${categoryID}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Faq
        .find({ tenancy: req.tenancy, categoryID })
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          cb(null, doc);
        });
    }
  });
};

exports.xxxxxxmodelAllPlans = (req, cb) => {
  const key = `__tenancy:${req.tenancy}__plans__publish__`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Plan
        .find({ tenancy: req.tenancy, publish: true })
        .sort({
          price: 1,
        })
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          cb(null, doc);
        });
    }
  });
};

exports.multimediaByKey = (req, bykey, cb) => {
  const key = `__tenancy:${req.tenancy}__multimedia__${bykey}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Multimedia
        .findOne({ tenancy: req.tenancy, key: bykey })
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          if (doc) {
            _.each(doc.sizes, (size) => {
              _.each(doc.files, (file) => {
                _.set(doc, `urlSize.${file}.x${size}`, `${appCnf.url.cdn}tenancy/${req.tenancy}/images/${appCnf.s3.folder}/multimedia/${doc.key}/${size}_${doc.key}.${file}`);
              });
            });
            _.each(doc.files, (file) => {
              _.set(doc, `url.${file}`, `${appCnf.url.cdn}tenancy/${req.tenancy}/images/${appCnf.s3.folder}/multimedia/${doc.key}/${doc.key}.${file}`);
            });
          }
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          cb(null, doc);
        });
    }
  });
};

const urls = [
  'https://marketsabana.com/',
  'https://santrato.com/',
];

exports.getUrlStores = (cb) => {
  const key = '__url_stores__';
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      async.auto({
        list: (cb) => {
          if (!urls) {
            return cb(null, []);
          }
          async.map(urls, (url, cb) => {
            https.get(`${url}v1/connectivity/stores`, (response) => {
              if (response.statusCode !== 200) {
                // eslint-disable-next-line no-console
                console.error(`${url} Response status was ${response.statusCode}`);
                return cb(null, []);
              }
              let body = '';
              response.on('data', (chunk) => {
                body += chunk;
              });
              response.on('end', () => {
                cb(null, JSON.parse(body));
              });
            }).on('error', (e) => {
              // eslint-disable-next-line no-console
              console.error('Got an error: ', e);
            });
          }, cb);
        },
        merge: ['list', (results, cb) => {
          const all = [];
          _.each(results.list, (list) => {
            _.merge(all, list.items);
          });
          // selecciona tiendas completas
          cb(null, _.chunk(_.shuffle(_.filter(all, (store) => {
            if (store.imageSizes) {
              return true;
            }
            return false;
          })), 12)[0]);
        }],
      }, (err, results) => {
        cb(null, results.merge);
      });
    }
  });
};
