/* eslint-disable no-console */
require('./constants');
global.appCnf = require('./appCnf');

const createError = require('http-errors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const shrinkRay = require('shrink-ray-current');
const cors = require('cors');

// Cache
const Redis = require('ioredis');
const cache = require('./libs/cache.lib');
const cacheHtml = require('./libs/cache-html.lib');
// Engines and Middleware
const ts = require('./libs/engine.ts.lib');
const js = require('./libs/engine.js.lib');
const site = require('./libs/middleware.site.lib');
const auth = require('./libs/middleware.auth.lib');
const {
  formatMoney, statusToDate, badge, mapImg, statusText, statusIcon,
} = require('./libs/util.lib');

global.formatMoney = formatMoney;
global.statusToDate = statusToDate;
global.badge = badge;
global.mapImg = mapImg;
global.statusText = statusText;
global.statusIcon = statusIcon;

global.client = new Redis(appCnf.redis.url, {
  keyPrefix: '',
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Only reconnect when the error contains "READONLY"
      return true; // or `return 1;`
    }
  },
});
global.client.connect(() => {
  console.log(`Redis conectdo a: ${appCnf.redis.url}`);
  global.client.flushall('ASYNC', (err, succeeded) => {
    console.log('Redis flush cache', succeeded);
  });
});

global.redisMiddleware = cache;
global.cacheHtml = cacheHtml;

mongoose.Promise = require('bluebird');

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}
const dbOptions = {
  promiseLibrary: global.Promise,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  sslValidate: true,
};
mongoose.connect(appCnf.db, dbOptions).then(
  () => {
    console.log(`MongoDB conectdo a: ${appCnf.db}`);

    // Genera scripts
    if (process.env.NODE_ENV !== 'production') {
      ts();
      js({
        src: path.join(__dirname, 'public'),
        tmp: 'tmp',
        js: 'sources',
        sourceMap: true,
        debug: true,
      });
    }
  },
  (err) => {
    console.log('MongoDB error', err);
    process.exit(1);
  },
);
// modelos
global.models = require('./models');

const app = express();
app.use(cors({
  origin: [
    /\.santratro\.com$/,
    'localhost:3000',
  ],
}));
// carga site
app.use(site);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.basedir = __dirname;

app.use(logger('dev'));

// compress all requests
app.use(shrinkRay({
  useZopfliForGzip: false,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }

    return shrinkRay.filter(req, res);
  },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload());
app.use(cookieParser(appCnf.keySecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);

require('./routes')(app);
require('./modules')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (process.env.NODE_ENV === 'production') {
    res.locals.error = {};
    err.stack = '';
  } else {
    console.log('-------------------------------------------------');
    console.trace();
  }
  if (req.originalUrl.split('/')[1] === 'v1') {
    res.status(err.status || 500).send(err);
  } else {
    res.status(err.status || 500).render('error.pug', { error: err, req });
  }
});

module.exports = app;
