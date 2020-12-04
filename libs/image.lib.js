/* eslint-disable no-console */
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const sharp = require('sharp');
const util = require('./util.lib');

const s3 = new AWS.S3({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
});

/**
 *
 * @param {*} pathImg slug store
 * @param {*} urlImg url de la imagen para descargar, null si proporciona local
 * @param {*} localImg path local imagen, null si proporciona url
 * @param {*} sizes lista de tamaños a modificar la imagen
 * @param {*} saveOriginal almacena imagen original
 * @param {*} cb callback
 */
exports.imageToS3 = (pathImg, urlImg, localImg, sizes, saveOriginal, cb) => {
  const nameTemp = util.makeid(10);
  const fileName = `./tmp/${nameTemp}`;
  const errors = [];

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
      const dir = `./public/${pathImg}`;
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, cb);
      } else {
        cb();
      }
    },
    download: ['makedir', (results, cb) => {
      if (!urlImg) {
        return cb();
      }
      const myURL = url.parse(urlImg);
      const file = fs.createWriteStream(fileName);
      let request;
      if (myURL.protocol === 'https:') {
        console.log(`Descargando archivo ${urlImg}`);
        request = https.get(urlImg, (response) => {
          // console.log(`Descarga con status: ${response.statusCode}`);

          if (response.statusCode !== 200) {
            errors.push({ field: 'url', msg: `Response status was ${response.statusCode}` });
            return cb(listErrors(400, null, errors));
          }

          response.pipe(file);
        });
      } else {
        request = http.get(urlImg, (response) => {
          // console.log(`Descarga con status: ${response.statusCode}`);

          if (response.statusCode !== 200) {
            errors.push({ field: 'url', msg: `Response status was ${response.statusCode}` });
            return cb(listErrors(400, null, errors));
          }

          response.pipe(file);
        });
      }

      file.on('finish', () => file.close(cb));

      request.on('error', (err) => {
        fs.unlinkSync(fileName);
        return cb(err.message);
      });

      file.on('error', (err) => {
        fs.unlinkSync(fileName);
        return cb(err.message);
      });
    }],
    copyFile: ['makedir', (_results, cb) => {
      if (!localImg) {
        return cb();
      }
      localImg.mv(fileName, cb);
    }],
    // genera JPG
    sizes: ['download', 'copyFile', (_results, cb) => {
      console.log('Cortando imagen por tamaños');
      async.each(sizes, (size, cb) => {
        sharp(fileName)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .resize(size.x, size.y, {
            fit: 'contain',
            background: {
              r: 255, g: 255, b: 255, alpha: 1,
            },
          })
          .jpeg({ progressive: true })
          .toFile(`./tmp/${size.x}x${size.y}_${nameTemp}.jpg`, cb);
      }, cb);
    }],
    // genera WEBP
    sizesW: ['download', 'copyFile', (_results, cb) => {
      console.log('Cortando imagen por tamaños');
      async.each(sizes, (size, cb) => {
        sharp(fileName)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .resize(size.x, size.y, {
            fit: 'contain',
            background: {
              r: 255, g: 255, b: 255, alpha: 1,
            },
          })
          .webp()
          .toFile(`./tmp/${size.x}x${size.y}_${nameTemp}.webp`, cb);
      }, cb);
    }],
    original: ['download', 'copyFile', (_results, cb) => {
      console.log('Imagen original');
      sharp(fileName)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ progressive: true })
        .toFile(`./tmp/original_${nameTemp}.jpg`, cb);
    }],
    uploadSizes: ['sizes', 'makedirLocal', (_results, cb) => {
      if (process.env.NODE_ENV === 'production') {
        console.log('S3 por tamaños');
        async.each(sizes, (size, cb) => {
          const fileContent = fs.readFileSync(`./tmp/${size.x}x${size.y}_${nameTemp}.jpg`);
          // ajustes de s3
          const params = {
            Bucket: config.s3.bucket,
            Key: `${pathImg}/${size.x}x${size.y}.jpg`, // ruta donde va a quedar
            Body: fileContent,
            ContentType: 'image/jpeg',
            CacheControl: 'private, max-age=31536000',
            Expires: moment.tz().add(1, 'year').unix(),
            ACL: 'public-read',
            StorageClass: 'INTELLIGENT_TIERING',
          };
          // sube el archivo
          console.log('sube', `${pathImg}/${size.x}x${size.y}.jpg`);
          s3.upload(params, cb);
        }, cb);
      } else {
        // save local
        async.each(sizes, (size, cb) => {
          fs.copyFile(`./tmp/${size.x}x${size.y}_${nameTemp}.jpg`, `./public/${pathImg}/${size.x}x${size.y}.jpg`, cb);
        }, cb);
      }
    }],
    uploadSizesW: ['sizesW', 'makedirLocal', (_results, cb) => {
      if (process.env.NODE_ENV === 'production') {
        console.log('S3 por tamaños');
        async.each(sizes, (size, cb) => {
          const fileContent = fs.readFileSync(`./tmp/${size.x}x${size.y}_${nameTemp}.webp`);
          // ajustes de s3
          const params = {
            Bucket: config.s3.bucket,
            Key: `${pathImg}/${size.x}x${size.y}.webp`, // ruta donde va a quedar
            Body: fileContent,
            ContentType: 'image/webp',
            CacheControl: 'private, max-age=31536000',
            Expires: moment.tz().add(1, 'year').unix(),
            ACL: 'public-read',
            StorageClass: 'INTELLIGENT_TIERING',
          };
          // sube el archivo
          console.log('sube', `${pathImg}/${size.x}x${size.y}.webp`);
          s3.upload(params, cb);
        }, cb);
      } else {
        // save local
        async.each(sizes, (size, cb) => {
          fs.copyFile(`./tmp/${size.x}x${size.y}_${nameTemp}.webp`, `./public/${pathImg}/${size.x}x${size.y}.webp`, cb);
        }, cb);
      }
    }],
    uploadOriginal: ['original', 'makedirLocal', (_results, cb) => {
      if (!saveOriginal) {
        return cb();
      }

      if (process.env.NODE_ENV === 'production') {
        console.log('S3 original');
        const fileContent = fs.readFileSync(`./tmp/original_${nameTemp}.jpg`);
        // ajustes de s3
        const params = {
          Bucket: config.s3.bucket,
          Key: `${pathImg}/original.jpg`, // ruta donde va a quedar
          Body: fileContent,
          ContentType: 'image/jpeg',
          CacheControl: 'private, max-age=31536000',
          Expires: moment.tz().add(1, 'year').unix(),
          ACL: 'public-read',
          StorageClass: 'INTELLIGENT_TIERING',
        };
        // sube el archivo
        console.log('sube', `${pathImg}/original.jpg`);
        s3.upload(params, cb);
      } else {
        // save local
        fs.copyFile(`./tmp/original_${nameTemp}.jpg`, `./public/${pathImg}/original.jpg`, cb);
      }
    }],
    // Borra las imagenes temporales
    deleteSizes: ['uploadSizes', (_results, cb) => {
      async.each(sizes, (size, cb) => {
        fs.unlink(`./tmp/${size.x}x${size.y}_${nameTemp}.jpg`, cb);
      }, cb);
    }],
    deleteSizesW: ['uploadSizesW', (_results, cb) => {
      async.each(sizes, (size, cb) => {
        fs.unlink(`./tmp/${size.x}x${size.y}_${nameTemp}.webp`, cb);
      }, cb);
    }],
    deleteOriginal: ['uploadOriginal', (_results, cb) => {
      if (!saveOriginal) {
        return cb();
      }
      fs.unlink(`./tmp/original_${nameTemp}.jpg`, cb);
    }],
    deleteTemp: ['deleteSizes', 'deleteOriginal', (_results, cb) => {
      console.log('Borrando temporal');
      fs.unlink(fileName, cb);
    }],
  }, cb);
};
