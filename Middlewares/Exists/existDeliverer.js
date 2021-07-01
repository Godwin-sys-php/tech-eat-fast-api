const Deliverer = require('../../Models/Deliverer');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  Deliverer.findOne({ idDeliverer: req.params.idCommand })
    .then(deliverer => {
      if (deliverer) {
        Resto.findOne({ idRestaurant: deliverer.idRestaurant })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ delivererNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true,  });
          });
      } else {
        res.status(404).json({ delivererNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
}