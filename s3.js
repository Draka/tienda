/* eslint-disable import/no-extraneous-dependencies */

require('./constants');
global.appCnf = require('./appCnf');

const port = process.env.PORT || '3001';
const spdy = require('spdy');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'ok' });
});
const options = {
  spdy: {
    protocols: ['h2', 'spdy/3.1', 'http/1.1'],
    plain: false,

    // **optional**
    // Parse first incoming X_FORWARDED_FOR frame and put it to the
    // headers of every request.
    // NOTE: Use with care! This should not be used without some proxy that
    // will *always* send X_FORWARDED_FOR
    'x-forwarded-for': true,

    connection: {
      windowSize: 1024 * 1024, // Server's window size

      // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
      autoSpdy31: false,
    },
  },
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt'),
};
spdy
  .createServer(options, app)
  .listen(port, (error) => {
    if (error) {
      console.error(error);
      return process.exit(1);
    }
    console.log(`Listening on port: ${port}.`);
  });
