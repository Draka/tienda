/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const pug = require('pug');
const { modelSlug } = require('../../../libs/query.lib');
const { faqByCategoryID, modelAllPlans } = require('./query');

function template(data, template) {
  const fn = pug.compileFile(`./modules/pages/views/meta/${template}.pug`, {});
  const html = fn(data);
  return html;
}

const complex = [
  'row',
  'container',
  'container-fluid',
];

const mixtas = [
  'col',
];

const simples = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'div',
  'ul',
  'ol',
  'li',
  'b',
  'a',
  'br',
  'p',
];

const meta = (text, cb) => {
  // return parse(text);

  let re;

  // escapeHtml(unsafe) {
  text = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // complejas
  _.each(complex, (key) => {
    re = new RegExp(`\\[(${key})( .*?)?\\]`, 'igm');
    const matchAll = text.matchAll(re);
    for (const match of matchAll) {
      if (match[2] && /class="/.test(match[2])) {
        match[2] = match[2].replace('class="', `class="${key} `);
      } else {
        match[2] = `class="${key}" ${match[2]} `;
      }
      text = text.replace(match[0], `<div ${match[2]}>`);
      re = new RegExp(`\\[\\/${key}\\]`, 'igm');
      text = text.replace(re, '</div>');
    }
  });

  // mixtas
  _.each(mixtas, (key) => {
    re = new RegExp(`\\[(${key})-(\\w*)-(\\w*)( .*?)?\\]`, 'igm');
    const matchAll = text.matchAll(re);
    for (const match of matchAll) {
      if (match[4] && /class="/.test(match[2])) {
        match[4] = match[4].replace('class="', `class="${key}-${match[2]}-${match[3]} `);
      } else {
        match[4] = `class="${key}-${match[2]}-${match[3]}" ${match[4]} `;
      }
      text = text.replace(match[0], `<div ${match[4]}>`);
      re = new RegExp(`\\[\\/${key}-(\\w*)-(\\w*)\\]`, 'igm');
      text = text.replace(re, '</div>');
    }
  });

  // simples
  _.each(simples, (key) => {
    re = new RegExp(`\\[${key}( .*?)?\\]`, 'igm');
    text = text.replace(re, `<${key} $1>`);
    re = new RegExp(`\\[\\/${key}\\]`, 'igm');
    text = text.replace(re, `</${key}>`);
  });

  // especiales
  async.auto({
    plansTable: (cb) => {
      if (/\[plans-table slugs="([a-z0-9-, ]*)"\]/.test(text)) {
        const re = new RegExp('\\[plans-table slugs="([a-z0-9-, ]*)"\\]', 'igm');
        const matchAll = text.matchAll(re);
        const matchs = [];
        for (const match of matchAll) {
          matchs.push(match);
        }
        async.eachLimit(matchs, 5, (match, cb) => {
          const slugs = match[1].split(',');
          async.auto({
            items: (cb) => {
              modelAllPlans(cb);
            },
            features: ['items', (results, cb) => {
              const features = {};
              _.each(results.items, (item) => {
                if (slugs.indexOf(item.slug) !== -1) {
                  const lines = item.features.split('\n');
                  _.each(lines, (line) => {
                    const parts = line.split('=');
                    _.set(features, `${_.trim(parts[0])}.${item.slug}`, _.trim(parts[1]));
                  });
                }
              });
              cb(null, features);
            }],
          }, (err, results) => {
            text = text.replace(re, template({
              items: results.items,
              features: results.features,
            }, 'plans-table'));
            cb(err, null);
          });
        }, cb);
      } else {
        cb();
      }
    },
    faqCategory: (cb) => {
      if (/\[faq-category slug="([a-z0-9-, ]*)"\]/.test(text)) {
        const re = new RegExp('\\[faq-category slug="([a-z0-9-, ]*)"\\]', 'igm');
        const matchAll = text.matchAll(re);
        const matchs = [];
        for (const match of matchAll) {
          matchs.push(match);
        }
        async.eachLimit(matchs, 5, (match, cb) => {
          const slug = match[1];
          async.auto({
            item: (cb) => {
              modelSlug('FaqCategory', slug, cb);
            },
            items: ['item', (results, cb) => {
              if (!results.item) {
                return cb();
              }
              faqByCategoryID(results.item._id, cb);
            }],
          }, (err, results) => {
            if (!results.item) {
              return cb(err, null);
            }
            text = text.replace(re, template({
              category: results.item,
              items: results.items,
            }, 'faq'));
            cb(err, null);
          });
        }, cb);
      } else {
        cb();
      }
    },
    page: (cb) => {
      if (/\[page slug="([a-z0-9-]*)"\]/.test(text)) {
        const re = new RegExp('\\[page slug="([a-z0-9-]*)"\\]', 'igm');
        const matchAll = text.matchAll(re);
        const matchs = [];
        for (const match of matchAll) {
          matchs.push(match);
        }
        async.eachLimit(matchs, 5, (match, cb) => {
          async.auto({
            item: (cb) => {
              modelSlug('Page', match[1], cb);
            },
            meta: ['item', (results, cb) => {
              if (!results.item || !results.item.active) {
                return cb(null, '');
              }
              // Busca todos los meta para convertir
              meta(results.item.html, cb);
            }],
          }, (err, results) => {
            text = text.replace(match[0], results.meta);
            cb(err, null);
          });
        }, cb);
      } else {
        cb();
      }
    },
  }, (err) => cb(err, text));
};

module.exports = meta;
