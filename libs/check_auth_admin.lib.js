module.exports = (req, _res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    return next(listErrors(401));
  }
};
