const https = require('https');

const sqs = new AWS.SQS({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
  region: 'us-east-1',
});

module.exports = (data, user, cb) => {
  if (process.env.NODE_ENV !== 'production') {
    return cb();
  }
  async.auto({
    sqs: (cb) => {
      data.source = {
        name: _.get(req, 'site.email.title'),
        email: _.get(req, 'site.email.emailInfo'),
      };
      data.replyToAddresses = [
        _.get(req, 'site.email.emailNoreply'),
      ];
      data.site = {
        name: _.get(req, 'site.name'),
        urlSite: appCnf.url.site,
        urlStatic: appCnf.url.cdn,
        info: _.get(req, 'site.email.emailInfo'),
        title: _.get(req, 'site.email.title'),
      };
      const params = {
        DelaySeconds: 0,
        MessageAttributes: {
          Data: {
            DataType: 'String',
            StringValue: JSON.stringify(data),
          },
          UserID: {
            DataType: 'String',
            StringValue: (user && user._id) ? user._id.toString() : '',
          },
          Tenancy: {
            DataType: 'String',
            StringValue: req.tenancy,
          },
        },
        MessageBody: 'correo',
        QueueUrl: appCnf.s3.sqs,
      };
      sqs.sendMessage(params, cb);
    },
    try: ['sqs', (results, cb) => {
      cb();
      if (!data.noNow && process.env.NODE_ENV === 'production') {
        https.get(appCnf.s3.urlExSQS, () => {});
      }
    }],
  }, cb);
};
