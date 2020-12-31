const http = require('http');
const https = require('https');

module.exports = (req, res) => {
  const errors = [];
  const body = _.pick(req.body, [
    'event',
    'data',
    'environment',
    'signature',
    'timestamp',
    'sent_at',
  ]);
  const data = JSON.stringify(body);
  async.auto({
    validate: (cb) => {
      if (req.params.token !== 'token666') {
        errors.push({ field: 'eventos', msg: 'Evento no soportado.' });
      }
      if (body.event !== 'transaction.updated') {
        errors.push({ field: 'eventos', msg: 'Evento no soportado.' });
      }
      if (body.environment !== 'prod' && body.environment !== 'test') {
        errors.push({ field: 'eventos', msg: 'Evento no soportado.' });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    // Cualquier tienda debe dirigir el flujo
    whereGo: ['validate', (_results, cb) => {
      const reference = _.get(body, 'data.transaction.reference');
      const tenancyGet = reference.split('__');
      let tenancyHost = global.tenancyUrl[tenancyGet[0]];
      if (tenancyGet.length >= 2 && tenancyHost) {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        };
        if (process.env.NODE_ENV !== 'production') {
          tenancyHost = `http://localhost:${process.env.PORT}/`;
          const url = `${tenancyHost}v1/services/events/token666`;
          const req = http.request(url, options, (res) => {
            console.log(`${url} statusCode: ${res.statusCode}`);
            cb(null, res.statusCode);
          });
          req.on('error', (e) => {
            console.error(e);
          });
          req.write(data);
          req.end();
        } else {
          const url = `${tenancyHost}v1/services/events/token666`;
          const req = https.request(url, options, (res) => {
            console.log(`${url} statusCode: ${res.statusCode}`);
            cb(null, res.statusCode);
          });
          req.on('error', (e) => {
            console.error(e);
          });
          console.log(data);
          req.write(data);
          req.end();
        }
      } else {
        const url = 'https://api-tienda.p4s.co/v1/eventos/token666';
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        };
        const req = https.request(url, options, (res) => {
          console.log(`${url} statusCode: ${res.statusCode}`);
          cb(null, res.statusCode);
        });
        req.on('error', (e) => {
          console.error(e);
        });
        req.write(data);
        req.end();
      }
    }],
  }, (err, results) => {
    res.status(results.whereGo || 400).send(err || results);
  });
};
