const { resolve } = require('path');
const { readdir } = require('fs').promises;
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
});

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

module.exports = (req, res, next) => {
  getFiles('./public')
    .then((files) => {
      async.mapLimit(files, 2, (file, cb) => {
        const ext = path.extname(file);
        if ([
          '.jpg',
          '.webp',
          '.svg',
          '.png',
          '.css',
          '.js',
          '.map',
          '.txt',
          '.ico',
          '.xml',
          '.csv',
          '.eot',
          '.ttf',
          '.woff',
          '.woff2',
        ].indexOf(ext) === -1) {
          return cb();
        }
        fs.readFile(file, (err, fileContent) => {
          const pathKey = file.split('/public/')[1];
          const params = {
            Bucket: config.s3.bucket,
            Key: pathKey, // ruta donde va a quedar
            Body: fileContent,
            CacheControl: 'private, max-age=31536000',
            ContentType: mime.lookup(file),
            Expires: moment.tz().add(1, 'year').unix(),
            ACL: 'public-read',
            StorageClass: 'INTELLIGENT_TIERING',
          };

          console.log('fin', file);
          s3.upload(params, cb);
        });
      }, (err) => {
        if (err) {
          return next(err);
        }
        res.send({ num: files.length });
      });
    })
    .catch((e) => next(e));
};
