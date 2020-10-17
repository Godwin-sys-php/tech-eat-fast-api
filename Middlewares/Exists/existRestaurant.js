const Resto = require("../../Models/Restaurants");

module.exports = (req, res, next) => {
  Resto.findOne({ _id: req.params.idRestaurant })
    .then(resto => {
      if (resto) {
        next();
      } else {
        res.status(404).json({ restoNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};