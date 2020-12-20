/* eslint-disable no-console */
const sharp = require('sharp');

const path = require('path');
const fs = require('fs');

const getFilesJPG = (source) => fs.readdirSync(source).map((name) => path.join(source, name)).filter((source) => path.extname(source) === '.jpg');
const getFilesPNG = (source) => fs.readdirSync(source).map((name) => path.join(source, name)).filter((source) => path.extname(source) === '.png');
const sizes = [{ x: 343 }, { x: 1920 }, { x: 686 }];
const sizesPNG = [{ y: 460 }];

module.exports = () => {
  if (0 && process.env.NODE_ENV !== 'production') {
    async.auto({
      jpg: (cb) => {
        async.each(getFilesJPG(`./public/tenancy/${config.tenancy}/images/_home`), (d, cb) => {
          const st = path.parse(d);
          async.each(sizes, (size, cb) => {
            sharp(d)
              .resize({
                width: size.x,
              })
              .jpeg({ progressive: true })
              .toFile(`./${st.dir.replace('_home', 'home')}/${size.x}_${st.name}.jpg`, cb);
          }, cb);
          console.log(
            `optimized ${d}`,
          );
        }, cb);
      },
      webp: (cb) => {
        async.each(getFilesJPG(`./public/tenancy/${config.tenancy}/images/_home`), (d, cb) => {
          const st = path.parse(d);
          async.each(sizes, (size, cb) => {
            sharp(d)
              .resize({
                width: size.x,
              })
              .webp({ progressive: true })
              .toFile(`./${st.dir.replace('_home', 'home')}/${size.x}_${st.name}.webp`, cb);
          }, cb);
          console.log(
            `optimized ${d}`,
          );
        }, cb);
      },
      pngJpg: (cb) => {
        async.each(getFilesPNG(`./public/tenancy/${config.tenancy}/images/_home`), (d, cb) => {
          const st = path.parse(d);
          async.each(sizesPNG, (size, cb) => {
            sharp(d)
              .resize({
                width: size.x,
              })
              .jpeg({ progressive: true })
              .toFile(`./${st.dir.replace('_home', 'home')}/${size.y}_${st.name}.jpg`, cb);
          }, cb);
          console.log(
            `optimized ${d}`,
          );
        }, cb);
      },
      pngWebp: (cb) => {
        async.each(getFilesPNG(`./public/tenancy/${config.tenancy}/images/_home`), (d, cb) => {
          const st = path.parse(d);
          async.each(sizesPNG, (size, cb) => {
            sharp(d)
              .resize({
                width: size.x,
              })
              .webp({ progressive: true })
              .toFile(`./${st.dir.replace('_home', 'home')}/${size.y}_${st.name}.webp`, cb);
          }, cb);
          console.log(
            `optimized ${d}`,
          );
        }, cb);
      },
    }, () => {});
  }
};
