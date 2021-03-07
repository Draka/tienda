exports.deleteKeysByPattern = (key) => {
  const stream = client.scanStream({
    match: key,
  });

  stream.on('data', (resultKeys) => {
    if (resultKeys.length) {
      client.unlink(resultKeys);
    }
  });
};
