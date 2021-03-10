exports.deleteKeysByPattern = (key) => {
  const stream = client.scanStream({
    match: `_${appCnf.tenancy}_${key}`,
  });

  stream.on('data', (resultKeys) => {
    _.each(resultKeys, (k) => {
      client.unlink(k.replace(`_${appCnf.tenancy}_`, ''));
    });
  });
};
