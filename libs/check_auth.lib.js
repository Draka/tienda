module.exports = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    if (req.originalUrl.split('/')[1] === 'v1') {
      return next(listErrors(401));
    }
    res.status(401).render('pages/users/login', {
      title: 'Iniciar Sesión',
      js: 'page',
      returnPage: req.originalUrl,
    });
  }
};
