const Commands = require('../../Models/Commands');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  Commands.findOne({ _id: req.params.idCommand })
    .then(command => {
      if (command) {
        Resto.findOne({ _id: command.idRestaurant })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ commandNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(404).json({ commandNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}