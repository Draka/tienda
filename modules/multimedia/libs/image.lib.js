/* eslint-disable no-console */
const fs = require('fs');
const sharp = require('sharp');
const mime = require('mime-types');
const { isInteger } = require('lodash');
const util = require('../../../libs/util.lib');

const s3 = new AWS.S3({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
});

function resizes(fileName, nameTemp, ext, sizes, cb) {
  async.eachLimit(sizes, 5, (size, cb) => {
    switch (ext) {
      case 'jpg':
        sharp(fileName)
          .flatten({
            background: {
              r: 255, g: 255, b: 255, alpha: 1,
            },
          })
          .resize({
            fit: sharp.fit.contain,
            width: _.isInteger(size.x) ? size.x : null,
          }).jpeg({ progressive: true })
          .toFile(`./tmp/${size.x}_${nameTemp}.jpg`, cb);
        break;
      case 'webp':
        sharp(fileName)
          .flatten({
            background: {
              r: 255, g: 255, b: 255, alpha: 1,
            },
          })
          .resize({
            fit: sharp.fit.contain,
            width: _.isInteger(size.x) ? size.x : null,
          }).webp()
          .toFile(`./tmp/${size.x}_${nameTemp}.webp`, cb);
        break;
      case 'png':
        sharp(fileName)
          .resize({
            fit: sharp.fit.contain,
            width: _.isInteger(size.x) ? size.x : null,
          }).png()
          .toFile(`./tmp/${size.x}_${nameTemp}.png`, cb);
        break;
      default:
        cb();
    }
  }, cb);
}
function uploadImages(fileName, nameTemp, ext, sizes, pathImg, key, cb) {
  async.eachLimit(sizes, 5, (size, cb) => {
    const fileContent = fs.readFileSync(`./tmp/${size.x}_${nameTemp}.${ext}`);
    // ajustes de s3
    const params = {
      Bucket: appCnf.s3.bucket,
      Key: `tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}/${size.x}_${key}.${ext}`, // ruta donde va a quedar
      Body: fileContent,
      ContentType: mime.lookup(`./tmp/${nameTemp}.${ext}`),
      CacheControl: 'private, max-age=31536000',
      Expires: moment.tz().add(1, 'year').unix(),
      ACL: 'public-read',
      StorageClass: 'INTELLIGENT_TIERING',
    };
    s3.upload(params, cb);
  }, cb);
}
function uploadLocalImages(fileName, nameTemp, ext, sizes, pathImg, key, cb) {
  async.eachLimit(sizes, 5, (size, cb) => {
    fs.copyFile(`./tmp/${size.x}_${nameTemp}.${ext}`, `./public/tenancy/${appCnf.tenancy}/images/${appCnf.s3.folder}/${pathImg}/${size.x}_${key}.${ext}`, cb);
  }, cb);
}
function deleteTemImages(nameTemp, ext, sizes, cb) {
  async.eachLimit(sizes, 5, (size, cb) => {
    fs.unlink(`./tmp/${size.x}_${nameTemp}.${ext}`, cb);
  }, cb);
}

exports.imageToS3 = (pathImg, key, localImg, sizes, cb) => {
  const nameTemp = util.makeid(10);
  let originalExt = _.last(localImg.name.split('.'));
  if (localImg.mimetype === 'image/png') {
    originalExt = 'png';
  } else if (localImg.mimetype === 'image/jpeg') {
    originalExt = 'jpg';
  }
  const fileName = `./tmp/${nameTemp}`;
  const convert = ['png', 'jpg'].indexOf(originalExt) >= 0;

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
      localImg.mv(fileName, cb);
    }],
    // convierte a otros formatos
    images: ['copyFile', (_results, cb) => {
      switch (originalExt) {
        case 'jpg':
          async.auto({
            jpg: (cb) => {
              resizes(fileName, nameTemp, 'jpg', sizes, cb);
            },
            webp: (cb) => {
              resizes(fileName, nameTemp, 'webp', sizes, cb);
            },
          }, cb);
          break;
        case 'png':
          resizes(fileName, nameTemp, 'png', sizes, cb);
          break;
        default:
          cb();
      }
    }],
    uploadImages: ['images', 'makedirLocal', (_results, cb) => {
      if (process.env.NODE_ENV === 'production' || appCnf.s3.forced) {
        switch (originalExt) {
          case 'jpg':
            async.auto({
              jpg: (cb) => {
                uploadImages(fileName, nameTemp, 'jpg', sizes, pathImg, key, cb);
              },
              webp: (cb) => {
                uploadImages(fileName, nameTemp, 'webp', sizes, pathImg, key, cb);
              },
            }, cb);
            break;
          case 'png':
            uploadImages(fileName, nameTemp, 'png', sizes, pathImg, key, cb);
            break;
          default:
            cb();
        }
      } else {
        cb();
      }
    }],
    uploadImagesLocal: ['images', 'makedirLocal', (_results, cb) => {
      if (process.env.NODE_ENV !== 'production') {
        // save local
        switch (originalExt) {
          case 'jpg':
            async.auto({
              jpg: (cb) => {
                uploadLocalImages(fileName, nameTemp, 'jpg', sizes, pathImg, key, cb);
              },
              webp: (cb) => {
                uploadLocalImages(fileName, nameTemp, 'webp', sizes, pathImg, key, cb);
              },
            }, cb);
            break;
          case 'png':
            uploadLocalImages(fileName, nameTemp, 'png', sizes, pathImg, key, cb);
            break;
          default:
            cb();
        }
      } else {
        cb();
      }
    }],
    uploadOriginal: ['copyFile', 'makedirLocal', (_results, cb) => {
      if (convert) {
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
      if (convert) {
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
    deleteSizes: ['uploadImages', 'uploadImagesLocal', (_results, cb) => {
      switch (originalExt) {
        case 'jpg':
          async.auto({
            jpg: (cb) => {
              deleteTemImages(nameTemp, 'jpg', sizes, cb);
            },
            webp: (cb) => {
              deleteTemImages(nameTemp, 'webp', sizes, cb);
            },
          }, cb);
          break;
        case 'png':
          deleteTemImages(nameTemp, 'png', sizes, cb);
          break;
        default:
          cb();
      }
    }],
    deleteOriginal: ['images', 'uploadOriginal', 'uploadOriginalLocal', (_results, cb) => {
      fs.unlink(fileName, cb);
    }],
  }, cb);
};
