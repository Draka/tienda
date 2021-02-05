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
  storeImageSizes: {
    logo: [{ x: 48, y: 48 }, { x: 96, y: 96 }, { x: 196, y: 196 }, { x: 392, y: 392 }, { x: 484, y: 484 }, { x: 600, y: 600 }],
    header: [{ x: 1003, y: 196 }, { x: 2048, y: 460 }],
    social: [{ x: 373, y: 196 }, { x: 1028, y: 540 }],
  },
  storeImageFit: {
    logo: 'contain',
    header: 'cover',
    social: null,
  },
  __: (str, a1, a2) => str.replace('%s', a1).replace('%s', a2),
  socialMedia: [
    ['facebook', 'Facebook', 'url', '', 'fab fa-facebook-square'],
    ['twitter', 'Twitter', 'url', '', 'fab fa-twitter-square'],
    ['instagram', 'Instagram', 'url', '', 'fab fa-instagram-square'],
    ['whatsapp', 'Whatsapp', 'text', { cellphone: 'cellphone' }, 'fab fa-whatsapp-square'],
    ['email', 'Correo Electrónico', 'email', '', 'fas fa-envelope'],
    ['web', 'Página Web', 'url', '', 'fas fa-globe'],
  ],
  forbidden: [
    'usuario',
    'administracion',
    'pedidos',
    'iniciar-sesion',
    'registro',
    'registro-confirmacion',
    'recuperar-contrasena',
    'recuperar-contrasena-confirmacion',
    'cerrar-sesion',
    'carrito',
    'v1',
    'ayuda',
    'lib',
  ],
  payments: [
    {
      slug: 'wompi',
      name: 'Wompi',
      description: 'Pago seguro con tarjetas crédito y debito y otros medios de pago',
    },
    {
      slug: 'contra-entrega',
      name: 'Contra-entrega',
      description: 'Pago contra entrega',
    },
  ],
  deliveries: [
    {
      name: 'Encomienda Nacional',
      slug: 'encomienda-nacional',
      description: 'Se usa una empresa de encomiendas a nivel nacional',
      payments: ['wompi'],
      virtualDelivery: false,
      personalDelivery: false,
    },
    {
      name: 'Encomienda Local',
      slug: 'encomienda-local',
      description: 'Se usa una empresa de encomiendas local',
      payments: ['wompi'],
      virtualDelivery: false,
      personalDelivery: false,
    },
    {
      name: 'Transporte Local',
      slug: 'transporte-local',
      description: 'El dueño de la tienda se encarga de llevar el producto',
      payments: ['wompi', 'contra-entrega'],
      virtualDelivery: false,
      personalDelivery: true,
    },
    {
      name: 'Producto Virtual',
      slug: 'virtual-product',
      description: 'No se necesita un envío físico, los detalles de la compra se enviarán por correo',
      payments: ['wompi'],
      virtualDelivery: true,
      personalDelivery: false,
    },
  ],
  tenancyUrl: {
    vendelomejor: 'https://vendelomejor.com/',
    marketsabana: 'https://marketsabana.com/',
    buenaventa: 'https://buenaventa.co/',
  },
};
_.forEach(vars, (v, i) => {
  global[i] = v;
});
