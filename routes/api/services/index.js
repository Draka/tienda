const geocoder = require('./geocoder');
const sendEmail = require('./send-email');
const checkSqs = require('./check-sqs');
const events = require('./events');
const redirectPayment = require('./redirect-payment');

module.exports = (app) => {
  app.get('/v1/services/geocoder', redisMiddleware, geocoder);
  app.get('/v1/services/send-email', sendEmail);
  app.get('/v1/services/check-sqs', checkSqs);
  app.post('/v1/services/events/:token', events);
  app.post('/v1/services/redirect-payment/:token', redirectPayment);
};
