module.exports = (req, res, next) => {
  async.auto({
    query: (cb) => {
      models.HelpCategory
        .find()
        .sort({ order: 1 })
        .exec(cb);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).send(results.query);
  });
};
