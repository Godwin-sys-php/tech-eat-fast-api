const _ = require('underscore');

module.exports = (req, res, next) => {
  const address = req.body.address;
  if (req.method === "POST") {
    _.isString(address) && address.length >= 5 && address.length < 80 ? next() : res.status(400).json({ invalidForm: true });
  } else {
    if (req.address.idUser == req.params.idUser) {
      _.isString(address) && address.length >= 5 && address.length < 80 ? next() : res.status(400).json({ invalidForm: true });
    } else {
      res.status(403).json({ invalidToken: true });
    }
  }
};