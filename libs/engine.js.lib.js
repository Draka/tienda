/* eslint-disable global-require */
/* eslint-disable no-console */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = (options) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  // const { detect } = require('detect-browser');

  const isDirectory = (source) => fs.lstatSync(source).isDirectory();

  const getDirectories = (source) => fs.readdirSync(source).map((name) => path.join(source, name)).filter(isDirectory);

  function treeFolders(src) {
    _.forEach(getDirectories(src), (d) => {
      treeFolders(d);
      if (fs.existsSync(`${d}/jss.json`)) {
        // eslint-disable-next-line import/no-dynamic-require
        const conf1 = require(`${d}/jss.json`);
        // eslint-disable-next-line no-param-reassign
        options.tmp = options.tmp || 'tmp';
        // crea temporal
        if (!fs.existsSync(`${d}/${options.tmp}`)) {
          fs.mkdirSync(`${d}/${options.tmp}`, { recursive: true });
        }
        const newFiles = _.map(conf1.files, (filename) => `${d}/${conf1.folder}/${filename}`);
        console.log('comprime');
        execSync(`cat ${newFiles.join(' ')} > ${d}/${options.tmp}/tmp`);
        execSync(`npx uglifyjs ${d}/${options.tmp}/tmp -o ${d}/${conf1.dst} --compress --mangle -- `);
      }
    });
  }
  treeFolders(options.src);
};
