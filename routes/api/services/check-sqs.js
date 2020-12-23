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
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/237646395144/mail',
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0,
      };
      sqs.receiveMessage(params, cb);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.send(results.getSQS);
  });
};
