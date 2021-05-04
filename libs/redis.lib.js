exports.deleteKeysByPattern = (tenancy, key) => {
  const stream = client.scanStream({
    match: `_${tenancy}_${key}`,
  });

  stream.on('data', (resultKeys) => {
    _.each(resultKeys, (k) => {
      client.unlink(k.replace(`_${tenancy}_`, ''));
    });
  });
};
