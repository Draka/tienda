const sqs = new AWS.SQS({
  accessKeyId: appCnf.s3.accessKeyId,
  secretAccessKey: appCnf.s3.secretAccessKey,
  region: 'us-east-1',
});

module.exports = (data, user, cb) => {
  data.source = {
    name: appCnf.email.title,
    email: appCnf.email.emailInfo,
  };
  data.replyToAddresses = [
    appCnf.email.emailNoreply,
  ];
  data.site = {
    name: appCnf.site.name,
    urlSite: appCnf.url.site,
    urlStatic: appCnf.url.static,
    info: appCnf.email.emailInfo,
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
        StringValue: appCnf.tenancy,
      },
    },
    MessageBody: 'correo',
    QueueUrl: appCnf.s3.sqs,
  };
  sqs.sendMessage(params, (err, m) => {
    console.log(err, m);
    cb(err, m);
  });
};
