/* eslint-disable no-console */
const fs = require('fs');
const sharp = require('sharp');
const mime = require('mime-types');
const util = require('../../../libs/util.lib');

const s3 = new AWS.S3({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
});

exports.imageToS3 = (pathImg, key, localImg, convert, cb) => {
  const nameTemp = util.makeid(10);
  const originalExt = _.last(localImg.name.split('.'));
  const fileName = `./tmp/${nameTemp}`;

  async.auto({
    makedir: (cb) => {
      const dir = './tmp';
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, cb);
      } else {
        cb();
      }
    },
    makedirLocal: (cb) => {
      if (process.env.NODE_ENV === 'production') {
        return cb();
      }
      const dir = `./public/tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}`;
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, cb);
      } else {
        cb();
      }
    },
    copyFile: ['makedir', 'makedirLocal', (_results, cb) => {
      if (!localImg) {
        return cb();
      }
      console.log(localImg, fileName);
      localImg.mv(fileName, cb);
    }],
    // convierte a otros formatos
    sizes: ['copyFile', (_results, cb) => {
      async.each(convert, (ext, cb) => {
        switch (ext) {
          case 'jpg':
            sharp(fileName)
              .jpeg({ progressive: true })
              .toFile(`./tmp/${nameTemp}.jpg`, cb);
            break;
          case 'webp':
            sharp(fileName)
              .webp()
              .toFile(`./tmp/${nameTemp}.webp`, cb);
            break;
          case 'png':
            sharp(fileName)
              .png()
              .toFile(`./tmp/${nameTemp}.png`, cb);
            break;
          default:
            cb();
        }
      }, cb);
    }],
    uploadSizes: ['sizes', 'makedirLocal', (_results, cb) => {
      if (process.env.NODE_ENV === 'production' || appCnf.s3.forced) {
        console.log('S3 por tamaños');
        async.each(convert, (ext, cb) => {
          const fileContent = fs.readFileSync(`./tmp/${nameTemp}.${ext}`);
          // ajustes de s3
          const params = {
            Bucket: appCnf.s3.bucket,
            Key: `tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}/${key}.${ext}`, // ruta donde va a quedar
            Body: fileContent,
            ContentType: mime.lookup(`./tmp/${nameTemp}.${ext}`),
            CacheControl: 'private, max-age=31536000',
            Expires: moment.tz().add(1, 'year').unix(),
            ACL: 'public-read',
            StorageClass: 'INTELLIGENT_TIERING',
          };
          // sube el archivo
          console.log('sube', `${pathImg}/${key}.${ext}`);
          s3.upload(params, cb);
        }, cb);
      } else {
        cb();
      }
    }],
    uploadSizesLocal: ['sizes', 'makedirLocal', (_results, cb) => {
      if (process.env.NODE_ENV !== 'production') {
        // save local
        async.each(convert, (ext, cb) => {
          fs.copyFile(`./tmp/${nameTemp}.${ext}`, `./public/tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}/${key}.${ext}`, cb);
        }, cb);
      } else {
        cb();
      }
    }],
    uploadOriginal: ['copyFile', 'makedirLocal', (_results, cb) => {
      if (convert.length) {
        return cb();
      }

      if (process.env.NODE_ENV === 'production' || appCnf.s3.forced) {
        console.log('S3 original');
        const fileContent = fs.readFileSync(fileName);
        // ajustes de s3
        const params = {
          Bucket: appCnf.s3.bucket,
          Key: `tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}/${key}.${originalExt}`, // ruta donde va a quedar
          Body: fileContent,
          ContentType: localImg.mimetype,
          CacheControl: 'private, max-age=31536000',
          Expires: moment.tz().add(1, 'year').unix(),
          ACL: 'public-read',
          StorageClass: 'INTELLIGENT_TIERING',
        };
        // sube el archivo
        console.log('sube', `${pathImg}/${key}`);
        s3.upload(params, cb);
      } else {
        cb();
      }
    }],
    uploadOriginalLocal: ['copyFile', 'makedirLocal', (_results, cb) => {
      if (convert.length) {
        return cb();
      }
      if (process.env.NODE_ENV !== 'production') {
        // save local
        fs.copyFile(fileName, `./public/tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}/${key}.${originalExt}`, cb);
      } else {
        cb();
      }
    }],
    // Borra las imagenes temporales
    deleteSizes: ['uploadSizes', 'uploadSizesLocal', (_results, cb) => {
      async.each(convert, (ext, cb) => {
        fs.unlink(`./tmp/${nameTemp}.${ext}`, cb);
      }, cb);
    }],
    deleteOriginal: ['sizes', 'uploadOriginal', 'uploadOriginalLocal', (_results, cb) => {
      fs.unlink(fileName, cb);
    }],
  }, cb);
};
