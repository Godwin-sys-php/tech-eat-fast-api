const Deliverer = require('../../Models/Deliverer');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  Deliverer.findOne({ _id: req.params.idCommand })
    .then(deliverer => {
      if (deliverer) {
        Resto.findOne({ _id: deliverer.idRestaurant, valid: true })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ delivererNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(404).json({ delivererNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}