exports.deleteKeysByPattern = (key) => {
  const stream = client.scanStream({
    match: `_${appCnf.tenancy}_${key}`,
  });

  stream.on('data', (resultKeys) => {
    if (resultKeys.length) {
      client.unlink(resultKeys);
    }
  });
};
