module.exports = (req, _res, next) => {
  if (req.user) {
    next();
  } else {
    return next(listErrors(401));
  }
};