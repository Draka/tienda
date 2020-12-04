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
