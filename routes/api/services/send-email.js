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
      console.log(params);
      sqs.receiveMessage(params, cb);
    },
    mailer: ['getSQS', (results, cb) => {
      async.eachLimit(results.getSQS.Messages, 5, (msg, cb) => {
        async.auto({
          mail: (cb) => {
            mailer(
              JSON.parse(_.get(msg, 'MessageAttributes.Data.StringValue') || '{}'),
              _.get(msg, 'MessageAttributes.UserID.StringValue'),
              _.get(msg, 'MessageAttributes.Tenancy.StringValue'),
              cb,
            );
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
    res.send(results);
  });
};
