const https = require('https');
const http = require('http');

let url = '';
if (process.env.NODE_ENV === 'production') {
  url = 'https://vendelomejor.com/v1/email/';
} else {
  url = 'http://localhost:3000/v1/email/';
}

exports.api = (path, cb) => {
  let r = '';
  if (process.env.NODE_ENV === 'production') {
    r = https;
  } else {
    r = http;
  }
  r.get(`${url}${path}`, (response) => {
    if (response.statusCode !== 200) {
      return cb(listErrors(response.statusCode, null, [{ field: 'api', msg: 'Error' }]));
    }
    let body = '';
    response.on('data', (chunk) => {
      body += chunk;
    });
    response.on('end', () => {
      cb(null, JSON.parse(body));
    });
  }).on('error', (e) => {
    cb(e);
  });
};
