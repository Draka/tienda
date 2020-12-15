/* eslint-disable no-console */
require('./constants');
global.config = require('./config');

const createError = require('http-errors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const shrinkRay = require('shrink-ray-current');

// Cache
const redis = require('redis');
const auth = require('./libs/auth.lib');
const cache = require('./libs/cache.lib');
const jsMiddleware = require('./libs/js_middleware.lib');
const tsMiddleware = require('./libs/ts_middleware.lib');
const { formatMoney } = require('./libs/util.lib');

global.formatMoney = formatMoney;
// Genera scripts
tsMiddleware();

global.client = redis.createClient({
  retry_strategy(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
  url: config.redis.url,
});
global.client.on('connect', () => {
  console.log('redis connected');
  global.client.flushall('ASYNC', (err, succeeded) => {
    console.log('flush cache', succeeded);
  });
});

global.redisMiddleware = cache;

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
mongoose.connect(config.db, dbOptions).then(
  () => {
    console.log('MongoDB open');
  },
  (err) => {
    console.log('MongoDB error', err);
    process.exit(1);
  },
);
// modelos
global.models = require('./models');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
app.use(cookieParser(config.keySecret));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(jsMiddleware({
  src: path.join(__dirname, 'public'),
  tmp: 'tmp',
  js: 'sources',
  sourceMap: true,
  debug: true,
}));
app.use(express.static(path.join(__dirname, `public/tenancy${config.tenancy}`)));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, `public/${config.s3.folder}`)));
app.use(auth);

require('./routes')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (process.env.NODE_ENV === 'production') {
    res.locals.error = {};
  }
  console.log(req.originalUrl.split('/'));
  if (req.originalUrl.split('/')[1] === 'v1') {
    console.error(err);
    res.status(err.status || 500).send(err);
  } else {
    res.status(err.status || 500).render('error.pug', { error: err });
  }
});

module.exports = app;
