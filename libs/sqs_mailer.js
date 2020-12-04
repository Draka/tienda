const sqs = new AWS.SQS({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: 'us-east-1',
});

module.exports = (data, user, cb) => {
  const params = {
    DelaySeconds: 0,
    MessageAttributes: {
      Data: {
        DataType: 'String',
        StringValue: JSON.stringify(data),
      },
      UserID: {
        DataType: 'String',
        StringValue: user._id.toString(),
      },
    },
    MessageBody: 'correo',
    QueueUrl: config.s3.sqs,
  };
  sqs.sendMessage(params, cb);
};
