const seedrandom = require('seedrandom');

exports.makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.formatMoney = (number, decPlaces = 0, simbol = '$', decSep = ',', thouSep = '.') => {
  const re = `\\d(?=(\\d{${3}})+${decPlaces > 0 ? '\\D' : '$'})`;
  // eslint-disable-next-line no-bitwise
  const num = number.toFixed(Math.max(0, ~~decPlaces));
  return simbol + num.replace('.', thouSep).replace(new RegExp(re, 'g'), `$&${decSep}`);
};

exports.capitalized = (str) => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    if (splitStr[i].length > 3) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
  }
  return splitStr.join(' ');
};
// Rating con semilla, para que no cambie
exports.rating = (str) => {
  const rng = seedrandom(str);
  return Math.floor(rng() * (50 - 40)) + 40;
};

/**
 * Indica si un producto esta disponible
 * @param {*} product
 */
exports.isAvailable = (product) => !((_.get(product, 'available.start') && moment.tz().isBefore(product.available.start))
  || (_.get(product, 'available.end') && moment.tz().isAfter(product.available.end)));

exports.statusToDate = (arr, status) => {
  const st = arr.find((s) => s.status === status);
  if (!st) {
    return '';
  }
  return moment.tz(st.date, global.tz).format('MMM Do YYYY, h:mm a');
};

const status = {
  created: 'Creado',
  verifying: 'Veificando pago',
  rejected: 'Rechazado',
  paid: 'Pagado',
  cancelled: 'Cancelado',
  cancelledAdmin: 'Cancelado',
  picking: 'Seleccionando Productos',
  ready: 'Listo Para Envíar',
  onway: 'En Camino',
  arrived: 'Llegó',
  missing: 'No Respondieron',
  completed: 'Completado',
};
const color = {
  created: 'primary',
  verifying: 'alert',
  rejected: 'error',
  paid: 'alert',
  cancelled: 'error',
  cancelledAdmin: 'error',
  picking: 'alert',
  ready: 'info',
  onway: 'info',
  arrived: 'info',
  missing: 'error',
  completed: 'action',
};
const icon = {
  created: 'fas fa-shopping-basket',
  verifying: 'fas fa-money-check-alt',
  rejected: 'fas fa-ban',
  paid: 'fas fa-money-check-alt',
  cancelled: 'fas fa-ban',
  cancelledAdmin: 'fas fa-ban',
  picking: 'fas fa-box-open',
  ready: 'fas fa-box',
  onway: 'fas fa-shipping-fast',
  arrived: 'fas fa-shipping-fast',
  missing: 'fas fa-shipping-fast',
  completed: 'fas fa-truck-loading',
};

exports.badge = (input) => `<span class="badge ${color[input]} inline p-0-5">${status[input]}</span>`;
exports.statusText = (input) => status[input];
exports.statusIcon = (input) => `<i class="${icon[input]}"></i>`;

exports.mapImg = (order) => {
  const accessToken = 'pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw';
  const url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-heart+285A98';
  const latlng = order.address.address ? `${order.address.location.coordinates[0]},${order.address.location.coordinates[1]}` : '-74.071683,4.601889';
  const zoom = order.address.address ? '14' : '11';
  const img = `${url}(${latlng})/${latlng},${zoom},0,0/484x484?access_token=${accessToken}`;
  return img;
};

exports.setPrice = (product) => {
  product.originalPrice = product.price;
  if (
    _.get(product, 'offer.percentage')
  && (
    (_.get(product, 'offer.available.start')
  && moment().isAfter(moment(product.offer.available.start)))
  || !_.get(product, 'offer.available.start')
  )
  && (
    (_.get(product, 'offer.available.end')
    && moment().isBefore(moment(product.offer.available.end))
    )
  || !_.get(product, 'offer.available.end')
  )
  ) {
    product.price = product.offer.price;
  }
};
