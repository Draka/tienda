const https = require('https');

exports.faqByCategoryID = (categoryID, cb) => {
  const key = `__faqs__categoryID__${categoryID}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Faq
        .find({ categoryID })
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

exports.modelAllPlans = (cb) => {
  const key = '__plans__publish__';
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Plan
        .find({ publish: true })
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

exports.multimediaByKey = (bykey, cb) => {
  const key = `__multimedia__${bykey}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.Multimedia
        .findOne({ key: bykey })
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          _.each(doc.sizes, (size) => {
            _.each(doc.files, (file) => {
              _.set(doc, `urlSize.${file}.x${size}`, `${appCnf.url.static}tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/multimedia/${doc.key}/${size}_${doc.key}.${file}`);
            });
          });
          _.each(doc.files, (file) => {
            _.set(doc, `url.${file}`, `${appCnf.url.static}tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/multimedia/${doc.key}/${doc.key}.${file}`);
          });
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          cb(null, doc);
        });
    }
  });
};

const urls = [
  'https://marketsabana.com/',
  'https://vendelomejor.com/',
  'https://buenaventa.co/',
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
            return cb();
          }
          async.map(urls, (url, cb) => {
            https.get(url, (response) => {
              if (response.statusCode !== 200) {
                // eslint-disable-next-line no-console
                console.error(`${url} Response status was ${response.statusCode}`);
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
          results.each((list) => {
            _.merge(all, list);
          });
          cb(null, all);
        }],
      }, (err, results) => {
        console.log(results);
        cb(null, []);
      });
    }
  });
};
