exports.userHistory = (req, userID, cb) => {
  const key = `__tenancy:${req.tenancy}__histories__${userID}`;
  client.get(key, (_err, reply) => {
    if (reply && process.env.NODE_ENV === 'production') {
      cb(null, JSON.parse(reply));
    } else {
      models.History
        .findOne({
          tenancy: req.tenancy,
          userID,
        })
        .populate({
          path: 'productIDs.productID',
          populate: {
            path: 'storeID',
            select: 'name slug approve publish',
          },
        })
        .limit(24)
        .lean()
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          client.set(key, JSON.stringify(doc), 'EX', 3600);
          cb(null, doc);
        });
    }
  });
};
