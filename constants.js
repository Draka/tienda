global._ = require('lodash');
global.moment = require('moment-timezone');
global.async = require('async');
global.validator = require('validator');
global.mongoose = require('mongoose');
global.AWS = require('aws-sdk');

global.listErrors = require('./libs/list_errors.lib');
global.checkAuth = require('./libs/check_auth.lib');
global.checkAuthAdmin = require('./libs/check_auth_store.lib');
global.checkAuthAdminStore = require('./libs/check_auth_store.lib');

const vars = {
  tz: 'America/Bogota',
  minPassword: 6,
  langDefault: 'es',
  activeOrders: 2,
  imagesSizes: [{ x: 48, y: 48 }, { x: 96, y: 96 }, { x: 196, y: 196 }, { x: 392, y: 392 }, { x: 484, y: 484 }],
  __: (str, a1, a2) => str.replace('%s', a1).replace('%s', a2),
  socialMedia: [
    ['facebook', 'Facebook', 'url', '', 'fab fa-facebook-square'],
    ['twitter', 'Twitter', 'url', '', 'fab fa-twitter-square'],
    ['whatsapp', 'Whatsapp', 'text', { cellphone: 'cellphone' }, 'fab fa-whatsapp-square'],
    ['email', 'Correo Electrónico', 'email', '', 'fas fa-envelope'],
    ['web', 'Página Web', 'url', '', 'fas fa-globe'],
  ],
};
_.forEach(vars, (v, i) => {
  global[i] = v;
});
