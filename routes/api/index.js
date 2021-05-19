/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

module.exports = (app) => {
  const isDirectory = (source) => lstatSync(source).isDirectory();

  const getDirectories = (source) => readdirSync(source).map((name) => join(source, name)).filter(isDirectory);
  _.forEach(getDirectories(__dirname), (d) => {
    require(d)(app);
  });
};
