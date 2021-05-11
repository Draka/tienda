exports.deleteKeysByPattern = (key) => {
  const stream = client.scanStream({
    match: key,
  });

  stream.on('data', (resultKeys) => {
    _.each(resultKeys, (k) => {
      client.unlink(k);
    });
  });
};
