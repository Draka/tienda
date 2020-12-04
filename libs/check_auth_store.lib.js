module.exports = (req, _res, next) => {
  if (req.user && (req.user.admin || req.user.adminStore)) {
    next();
  } else {
    return next(listErrors(401));
  }
};
