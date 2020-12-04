module.exports = (_req, res, next) => {
  models.User
    .find()
    .exec((err, doc) => {
      if (err) {
        next(err);
      } else {
        res.send(doc);
      }
    });
};
