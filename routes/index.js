/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

module.exports = (app) => {
  const isDirectory = (source) => lstatSync(source).isDirectory();

  const getDirectories = (source) => readdirSync(source).map((name) => join(source, name)).filter(isDirectory);
  _.forEach(getDirectories(__dirname), (d) => {
    require(d)(app);
  });

  const w = _.random(10000);
  app.get('/status', (req, res) => {
    const memory = process.memoryUsage();
    res.send({
      w,
      v: config.v,
      rss: memory.rss / 1048576,
      heapTotal: memory.heapTotal / 1048576,
      heapUsed: memory.heapUsed / 1048576,
    });
  });
  app.get('/flush', (req, res) => {
    global.client.flushall('ASYNC', (err, succeeded) => {
      res.send({
        flush: err || succeeded,
      });
    });
  });
};
