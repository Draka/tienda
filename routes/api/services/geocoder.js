const https = require('https');

module.exports = (req, res, next) => {
  const country = _.lowerCase(decodeURI(req.query.country || ''));
  const city = _.lowerCase(decodeURI(req.query.city || ''));
  const address = decodeURI(`${_.trim(req.query.streetType)} ${_.trim(req.query.street, '-# ')} ${_.trim(req.query.corner, '-# ')} ${_.trim(req.query.number, '-# ')}`);
  async.auto({
    historial: (cb) => {
      // consulta historial
      models.Address
        .findOne({
          input: _.lowerCase(`${country} ${city} ${address}`),
        })
        .select({
          address: 1,
          location: 1,
        })
        .lean()
        .exec(cb);
    },
    addresses: ['historial', (results, cb) => {
      // pregunta a geocode
      if (results.historial) {
        return cb(null, results.historial);
      }
      let body = '';
      https.get(`https://geo-api.miaguila.com/v4/search-addresses-places?keyword=${address}&city=${city}`, {
        headers: {
          // eslint-disable-next-line max-len
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJfaWQiOiI1OTQ1ZmUxMGFiNTJiNjI3YzRiMTM4OWIiLCJkZXZpY2VfaWQiOiI1NmYzOGJlYS0xODk1LTRjYzYtOTI5My1jNmFkNmY3NjNlMjAiLCJmY21faWQiOiJjZFc3a1RaT1FILVYxaG5WREdWN0d0OkFQQTkxYkhaa2hENVJRY3RwZjBkQ0ZNazlab0E4ZWxvLTZzQUU5ejFuWDQwUTJ0X040c0pJUWdNaVNEZ3ktSHBIZzFELTFQWGdQM0plUHh0SWJ1M2I0VHhibzJsM2QyUWRNUkduNnJpaFdTV1dmbzJxUkZUUkRHNEpuSXp1UHVJSUpwRDVrVnlHRi1pIiwiaWF0IjoxNjA3MzQ4NDA0LCJleHAiOjE2Mzg4ODQ0MDR9._ol3CYlGAlu93yQ9znKGdcv_R2Iuo_tR7jI1FrDE_6o',
        },
      }, (response) => {
        if (response.statusCode !== 200) {
          // errors.push({ field: 'address', msg: 'Dirección no encontrada' });
          // return cb(listErrors(400, null, errors));
          return cb();
        }
        response.on('data', (chunk) => {
          body += chunk;
        }).on('end', () => {
          const addresses = _.get(JSON.parse(body), 'results.0');
          cb(null, {
            input: _.lowerCase(`${country} ${city} ${address}`),
            address: addresses.formatted_address,
            location: addresses.geometry.location,
          });
        });
      }).on('error', (err) => cb(err.message));
    }],
    input: ['addresses', (results, cb) => {
      // guarda la dirección
      if (!results.historial && results.addresses) {
        const addresses = new models.Address(results.addresses);
        addresses.save(cb);
      } else {
        cb();
      }
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.addresses) {
      results.addresses.ok = true;
      res.send(results.addresses);
    } else {
      res.send({
        location: { lat: 4.592972563357392, lng: -74.08177719752672 },
        address,
        ok: false,
      });
    }
  });
};
