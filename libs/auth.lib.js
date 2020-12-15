const jwt = require('jsonwebtoken');
const query = require('./query.lib');

function isAuthenticated(token) {
  try {
    return jwt.verify(token, config.keySecret);
  } catch (err) {
    return false;
  }
}

module.exports = (req, res, next) => {
  global.originalUrl = ((req.originalUrl.split('?'))[0]).substring(1);
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || _.get(req, 'signedCookies.token');
  const payload = isAuthenticated(token);

  if (payload) {
    query.user(payload._id, (err, user) => {
      req.user = user;
      global.session = user;
      return next(err);
    });
    // Lo de abajo para cuando tenga tiempo
    // const browser = detect(req.headers['user-agent']);

    // async.auto({
    //   query: (cb) => {
    //     models.Session
    //       .findOne({
    //         userID: req.user._id,
    //         token,
    //       })
    //       .exec(cb);
    //   },
    //   check: ['query', (results, cb) => {
    //     if (!results.query) {
    //       return cb(listErrors(401));
    //     }
    //     cb();
    //   }],
    //   update: ['check', (results, cb) => {
    //     results.query.set({
    //       updatedAt: new Date(),
    //       ssid: req.body.ssid || 'apik',
    //       name: _.get(browser, 'name'),
    //       version: _.get(browser, 'version'),
    //       os: _.get(browser, 'os'),
    //       ip: req.headers['x-forwarded-for']
    //                     || req.connection.remoteAddress
    //                     || req.socket.remoteAddress
    //                     || (req.connection.socket ? req.connection.socket.remoteAddress : null),
    //       userAgent: browser ? '' : req.headers['user-agent'],
    //     }).save(cb);
    //   }],
    // }, next);
  } else {
    next();
  }
};
