/**
 * IMPORTANTE, USE SUS VARIABLES DE ENTORNO PARA CONFIGURAR
 * NO SUBA NADA AL REPO
 */

const tenancy = process.env.TENANCY || 'vendelomejor';

const enviroment = {
  v: '2.0.13',
  tenancy,
  db: process.env.MONGO_URL || 'mongodb://localhost/tienda',
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost/',
  },
  dbPrefix: process.env.DB_PREFIX || '',
  keySecret: process.env.KEY_SECRET || 'key',
  s3: {
    accessKeyId: process.env.AWS_KEY || 'AKIATOVGUG4EOMZ52P5I',
    secretAccessKey: process.env.AWS_ACCESS || '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',
    bucket: process.env.AWS_BUCKET || 'vendelomejor.com',
    folder: process.env.AWS_FOLDER || 'local',
    sqs: process.env.AWS_SQS || 'https://sqs.us-east-1.amazonaws.com/237646395144/mail',
    urlExSQS: process.env.AWS_EX_SQS || 'https://vendelomejor.com/v1/services/send-email',
    forced: false, // true para que en local se suba a s3, para pruebas
  },
  log: process.env.LOG || 'dev',
  url: {
    api: process.env.URL_API || '/v1/', // url del sitio
    site: process.env.URL_SITE || 'http://localhost:3000/', // url del sitio
    static: process.env.URL_STATIC || 'http://localhost:3000/', // url de css, js, iconos, deberia ser un s3 pero en local puede ser la misma maquina
  },
  files: process.env.FILES || 'local',
  site: {},
  mapbox: 'pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw',
  gtm: process.env.GTM || '',
};

module.exports = enviroment;
