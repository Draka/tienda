const AWS = require('aws-sdk');
const mailer = require('../../../libs/mailer');

const sqs = new AWS.SQS({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
  region: 'us-east-1',
});

module.exports = (req, res, next) => {
  async.auto({
    getSQS: (cb) => {
      const params = {
        AttributeNames: [
          'SentTimestamp',
        ],
        MaxNumberOfMessages: 5,
        MessageAttributeNames: [
          'All',
        ],
        QueueUrl: appCnf.s3.sqs,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0,
      };
      sqs.receiveMessage(params, cb);
    },
    mailer: ['getSQS', (results, cb) => {
      async.mapLimit(results.getSQS.Messages, 5, (msg, cb) => {
        async.auto({
          mail: (cb) => {
            const data = JSON.parse(_.get(msg, 'MessageAttributes.Data.StringValue') || '{}');
            data.tenancy = _.get(msg, 'MessageAttributes.Tenancy.StringValue');
            data.userID = _.get(msg, 'MessageAttributes.UserID.StringValue');
            mailer(data, cb);
          },
          deleteSQS: ['mail', (results, cb) => {
            const deleteParams = {
              QueueUrl: appCnf.s3.sqs,
              ReceiptHandle: msg.ReceiptHandle,
            };
            sqs.deleteMessage(deleteParams, cb);
          }],
        }, cb);
      }, cb);
    }],

  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send({ ok: results.mailer.length });
  });
};
