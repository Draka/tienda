module.exports = (req, res, next) => {
  async.auto({
    validate: (cb) => cb(),
  }, (err, _results) => {
    if (err) {
      return next(err);
    }

    res.send({
      location: { lat: 4.592972563357392, lng: -74.08177719752672 },
      address: `${_.trim(req.query.streetType)} ${_.trim(req.query.street)} #${_.trim(req.query.corner)}-${_.trim(req.query.number)}, `
      + `${_.trim(req.query.neighborhood)}, ${_.trim(req.query.extra)}, ${_.trim(req.query.city)}, ${_.trim(req.query.country)}`,
      ok: false,
    });
  });
};
