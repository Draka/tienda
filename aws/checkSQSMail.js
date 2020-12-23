const https = require('https');

const url = 'https://vendelomejor.com/v1/services/send-email';

exports.handler = async (_event) => {
  const promise = new Promise((resolve, reject) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', (e) => {
      reject(Error(e));
    });
  });
  return promise;
};
