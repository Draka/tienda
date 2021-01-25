module.exports = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const key = `__expIress__${req.originalUrl}` || req.url;
  client.get(key, (err, reply) => {
    if (reply) {
      const { expires, body } = JSON.parse(reply);
      res.setHeader('expires', expires);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(body);
    } else {
      res.sendResponse = res.send;
      const now = moment();
      const expires = now.add(3600, 'seconds').utc().format('ddd, D MMM YYYY HH:mm:ss [GMT]');
      res.setHeader('expires', `${expires}`);
      res.send = (body) => {
        client.set(key, JSON.stringify({ expires, body }), 'EX', 3600);
        res.sendResponse(body);
      };
      next();
    }
  });
};
