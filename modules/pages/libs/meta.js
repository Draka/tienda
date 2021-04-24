/* eslint-disable no-restricted-syntax */

const pug = require('pug');
const { modelSlug } = require('../../../libs/query.lib');
const {
  faqByCategoryID, modelAllPlans, multimediaByKey, getUrlStores,
} = require('./query');

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

const _meta = (text, html, cb) => {
  // return parse(text);

  let re;

  // escapeHtml(unsafe) {
  if (!html) {
    text = text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
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
      text = text.replace(match[0], `<div ${_.get(match, 2)}>`);
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
      if (/\[faq-category slug="([a-z0-9-]*)"\]/.test(text)) {
        const re = new RegExp('\\[faq-category slug="([a-z0-9-]*)"\\]', 'igm');
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
            text = text.replace(match[0], template({
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
    imgRes: (cb) => {
      if (/\[img-res key="([a-zA-Z0-9-]*)" sizes="([x0-9,]*)"\]/.test(text)) {
        const re = new RegExp('\\[img-res key="([a-z0-9-]*)" sizes="([x0-9,]*)"\\]', 'igm');
        const matchAll = text.matchAll(re);
        const matchs = [];
        for (const match of matchAll) {
          matchs.push(match);
        }
        async.eachLimit(matchs, 5, (match, cb) => {
          const key = match[1];
          async.auto({
            item: (cb) => {
              multimediaByKey(key, cb);
            },
          }, (err, results) => {
            if (!results.item) {
              return cb(err, null);
            }
            text = text.replace(match[0], template({
              item: results.item,
              sizes: match[1].split(','),
            }, 'img-responsive'));
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
              _meta(results.item.html, html, cb);
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
    stores: (cb) => {
      if (/\[stores\]/.test(text)) {
        const re = new RegExp('\\[stores\\]', 'igm');
        const matchAll = text.matchAll(re);
        const matchs = [];
        for (const match of matchAll) {
          matchs.push(match);
        }
        async.eachLimit(matchs, 5, (match, cb) => {
          async.auto({
            items: (cb) => {
              getUrlStores(cb);
            },
            meta: ['items', (results, cb) => {
              if (!results.item || !results.item.active) {
                return cb(null, '');
              }
              // Busca todos los meta para convertir
              _meta(results.item.html, html, cb);
            }],
          }, (err, results) => {
            if (!results.items) {
              return cb(err, null);
            }
            text = text.replace(match[0], template({
              items: results.items,
            }, 'stores'));
            cb(err, null);
          });
        }, cb);
      } else {
        cb();
      }
    },
    siteName: (cb) => {
      text = text.replace(/\[site-name\]/g, _.get(appCnf, 'site.name'));
      cb();
    },
    siteDescription: (cb) => {
      text = text.replace(/\[site-description\]/g, _.get(appCnf, 'site.description'));
      cb();
    },
    siteEmail: (cb) => {
      text = text.replace(/\[site-email\]/g, `<a href=""mailto:${_.get(appCnf, 'site.email.emailInfo')}>${_.get(appCnf, 'site.email.emailInfo')}</a>`);
      cb();
    },
    logoCuadrado: (cb) => {
      text = text.replace(/\[logo-cuadrado\]/g,
        `<img class="h-96p" src="${
          _.get(appCnf, 'site.images.logoSquare.svg')
        }" alt="${_.get(appCnf, 'site.name')} logo nombre">`);
      cb();
    },
    menu: (cb) => {
      text = text.replace(/\[menu\]/g, '<ul class="flex menu" role="menu">');
      text = text.replace(/\[\/menu\]/g, '</ul>');
      text = text.replace(/\[menu-mob\]/g, '<ul class="list" role="menu">');
      text = text.replace(/\[\/menu-mob\]/g, '</ul>');
      text = text.replace(/\[item\]/g, '<li role="menuitem">');
      text = text.replace(/\[\/item\]/g, '</li>');
      cb();
    },
    searchStore: (cb) => {
      text = text.replace(/\[menu\]/g, '<form class="flex search" action="/tiendas/buscar">'
      + '<label class="out-screen" for="query-d">Buscar</label>'
      + '<input class="input--simple w-100 rdtl-50 rdbl-50 ph-0-25 pw-1" id="query-d" type="text" name="q" placeholder="Buscar tiendas" required="">'
      + '<button class="btn btn--secondary"><i class="fas fa-search"></i><span class="out-screen">Buscar tiendas</span></button>'
      + '</form>');
      cb();
    },
  }, (err) => cb(err, text));
};

const meta = (page, text, html, cb) => {
  const key = `__page_render__${page}`;
  client.get(key, (_err, reply) => {
    if (reply) {
      cb(null, reply);
    } else {
      _meta(text, html, (err, xtext) => {
        if (err) {
          return cb(err);
        }
        client.set(key, xtext, 'EX', 3600);
        cb(null, xtext);
      });
    }
  });
};
const metaNoCache = (page, text, html, cb) => {
  _meta(text, html, (err, xtext) => {
    if (err) {
      return cb(err);
    }
    // client.set(key, xtext, 'EX', 3600);
    cb(null, xtext);
  });
};

exports.meta = meta;
exports.metaNoCache = metaNoCache;
