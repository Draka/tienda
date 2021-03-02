/* eslint-disable no-restricted-syntax */
// import axios from 'axios';
// import cherrio from 'cheerio';

const https = require('https');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

exports.getUrlPage = (url, cb) => {
  const key = `__url_amz__${url}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      const d = moment.tz(global.tz).format('YYYY-MM-DD');
      async.auto({
        trm: (cb) => {
          if (_.get(appCnf.site, 'trm.date') !== d) {
            async.auto({
              trm: (cb) => {
                https.get(`https://trm-colombia.vercel.app/?date=${d}`, (response) => {
                  if (response.statusCode !== 200) {
                    // eslint-disable-next-line no-console
                    console.error(`${url} Response status was ${response.statusCode}`);
                    return cb(null, []);
                  }
                  let body = '';
                  response.on('data', (chunk) => {
                    body += chunk;
                  });
                  response.on('end', () => {
                    cb(null, JSON.parse(body));
                  });
                }).on('error', (e) => {
                  // eslint-disable-next-line no-console
                  console.error('Got an error: ', e);
                });
              },
              query: ['trm', (_results, cb) => {
                models.Site
                  .findOne()
                  .exec(cb);
              }],
              save: ['query', (results, cb) => {
                results.query.set({
                  trm: {
                    date: d,
                    cop: _.get(results.trm, 'data.value') || 0,
                  },
                }).save(cb);
              }],
              site: ['save', (results, cb) => {
                global.appCnf.site = results.save;
                cb();
              }],
            }, cb);
          } else {
            cb();
          }
        },
        amz: ['trm', async (_results) => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(url);
          let title = await page.evaluate(() => document.title);

          const bodyHTML = await page.evaluate(() => document.body.innerHTML);
          const $ = cheerio.load(bodyHTML);
          let price = $('#priceblock_ourprice').text() || $('.a-size-base.a-color-price').text() || '0';
          await browser.close();

          price = _.trim(price.replace('$', '').replace('US', ''));

          title = _.trim(_.get(_.split(title, ':'), '1'));
          price = Math.ceil((parseFloat(price) * appCnf.site.trm.cop) / 1000) * 1000;

          return { title, price };
        }],
      }, cb);
    }
  });
};
