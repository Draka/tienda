/* eslint-disable no-restricted-syntax */
// import axios from 'axios';
// import cherrio from 'cheerio';

const https = require('https');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

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
          puppeteer.use(StealthPlugin());
          const browser = await puppeteer.launch({
            headless: true,
            userDataDir: './tmp',
            defaultViewport: { width: 1920, height: 1080 },
            args: [
              '--disable-gpu',
              '--disable-dev-shm-usage',
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--lang=es-CO,es',
            ],
          });
          const page = await browser.newPage();
          // await page.setDefaultNavigationTimeout(0);
          await page.goto(url);
          await page.once('load');

          const text = '33122';
          try {
            await page.waitForFunction(
              (text) => document.querySelector('body').innerText.includes(text),
              {},
              text,
            );
          } catch (e) {
            await page.evaluate(() => {
              document.getElementById('nav-global-location-data-modal-action').click();
            });

            await page.waitForSelector('#GLUXZipUpdateInput');
            await page.type('#GLUXZipUpdateInput', '33122', { delay: 20 });
            await page.click('#GLUXZipUpdate input');

            await page.evaluate(() => document.querySelector('#GLUXConfirmClose').click());
          }

          try {
            await page.evaluate(() => {
              const elements = document.getElementById('altImages').getElementsByClassName('a-button-thumbnail');
              for (const element of elements) { element.click(); }
            });

            let title = await page.evaluate(() => document.title);
            const bodyHTML = await page.evaluate(() => document.body.innerHTML);
            const $ = cheerio.load(bodyHTML);
            await page.screenshot({
              path: 'public/m1.png',
            });

            // precio
            let price = $('#price #priceblock_ourprice').text() || '0';
            price = parseFloat(_.trim(price.replace('$', '').replace('US', '')));
            // titulo
            title = _.trim(_.get(_.split(title, ':'), '1'));
            // marca
            let brandText = _.trim($('#bylineInfo').text().replace(/(Visita la tienda de)|(Marca:)/, ''));
            // descripción
            const longDescription = `<ul>${$('#feature-bullets').find('ul').html()}</ul>`;
            // imagenes
            const images = [];
            $('#main-image-container').find('ul li.image img').each((i, img) => {
              images.push($(img).attr('src').replace(/._.*_/, ''));
            });
            // dimensiones
            const details = [];
            $('#productDetails_detailBullets_sections1').find('tr').each((i, obj) => {
              details.push(_.trim($(obj).text()));
            });
            $('#productDetails_techSpec_section_1').find('tr').each((i, obj) => {
              details.push(_.trim($(obj).text()));
            });
            let dimensions = [0, 0, 0];
            let weight = 0;
            _.each(details, (d) => {
              if (d.search(/dimensiones del producto/i) >= 0) {
                dimensions = _.trim(_.first(_.last(d.split('\n')).split(';')));
                if (dimensions.search('pulgadas') >= 0) {
                  dimensions = dimensions.replace(/pulgadas/i, '').split('x').map((d) => Math.ceil(parseFloat(_.trim(d)) * 2.54));
                } else {
                  dimensions = [0, 0, 0];
                }
              }
              if (d.search(/peso del producto/i) >= 0) {
                weight = _.trim(_.last(d.split('\n')));
                if (weight.search('pounds') >= 0) {
                  weight = Math.ceil(parseFloat(_.trim(weight.replace(/pounds/i, ''))));
                } else if (weight.search('onzas') >= 0) {
                  weight = Math.ceil(parseFloat(_.trim(weight.replace(/pounds/i, ''))) / 16);
                } else {
                  weight = 0;
                }
                weight *= 454;
              }
              if (!brandText && d.search(/fabricante/i) >= 0) {
                brandText = _.trim(_.last(d.split('\n')));
              }
            });
            await browser.close();

            return {
              title,
              trm: appCnf.site.trm.cop,
              price,
              brandText,
              longDescription,
              images,
              // details,
              dimensions,
              weight,
            };
          } catch (e) {
            await browser.close();
            return {
              title: '',
              trm: appCnf.site.trm.cop,
              price: 0,
              brandText: '',
              longDescription: '',
              images: [],
              dimensions: [0, 0, 0],
              weight: 0,
            };
          }
        }],
      }, cb);
    }
  });
};
