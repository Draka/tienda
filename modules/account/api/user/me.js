module.exports = (req, res, _next) => {
  models.User
    .findById(req.user._id)
    .select({
      email: 1,
      personalInfo: 1,
    })
    .exec((err, doc) => {
      if (err || !doc) {
        return listErrors(401, res);
      }
      res.send(doc);
    });
};
