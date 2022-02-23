/**
 * IMPORTANTE, USE SUS VARIABLES DE ENTORNO PARA CONFIGURAR
 * NO SUBA NADA AL REPO
 */

const enviroment = {
  v: '2.0.46',
  db: process.env.MONGO_URL || 'mongodb://localhost/santrato',
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost/',
  },
  dbPrefix: process.env.DB_PREFIX || '',
  keySecret: process.env.KEY_SECRET || 'key',
  s3: {
    accessKeyId: process.env.AWS_KEY || '',
    secretAccessKey: process.env.AWS_ACCESS || 'Q53je+OhZNNJqMj5hgyIVF7zSzPLQlN8jBT4JTi3',
    bucket: process.env.AWS_BUCKET || 'cdn.santrato.com',
    folder: process.env.AWS_FOLDER || 'local',
    sqs: process.env.AWS_SQS || 'https://sqs.us-east-1.amazonaws.com/323771421091/mail',
    urlExSQS: process.env.AWS_EX_SQS || 'https://santrato.com/v1/services/send-email',
    forced: false, // true para que en local se suba a s3, para pruebas
  },
  log: process.env.LOG || 'dev',
  url: {
    api: process.env.URL_API || 'http://localhost:3002/v1/', // url del sitio
    cdn: process.env.URL_CDN || 'http://localhost:3001/', // url de css, js, iconos, deberia ser un s3 pero en local puede ser la misma maquina
  },
  files: process.env.FILES || 'local',
  site: {},
  mapbox: 'pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw',
  gtm: process.env.GTM || '',
};

module.exports = enviroment;
