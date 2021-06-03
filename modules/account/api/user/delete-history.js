module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
    delHistory: ['validate', (results, cb) => {
      models.History
        .findOne({
          tenancy: req.tenancy,
          userID: req.user._id,
        })
        .exec((err, doc) => {
          if (err) {
            return cb(err);
          }
          if (doc) {
            const index = _.findIndex(doc.productIDs, (products) => products.productID.toString() === req.params.productID);
            if (index === -1) {
              return cb();
            }
            doc.productIDs.splice(index, 1);
            doc.save(cb);
          } else {
            const history = new models.History({
              tenancy: req.tenancy,
              userID: req.user._id,
              productIDs: [],
            });
            history.save(cb);
          }
        });
    }],
  }, (err, _results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send({ status: true });
  });
};
