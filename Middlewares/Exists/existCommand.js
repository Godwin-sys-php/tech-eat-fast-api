const Commands = require('../../Models/Commands');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  Commands.findOne({ idCommand: req.params.idCommand })
    .then(command => {
      if (command) {
        Resto.findOne({ idRestaurant: command.idRestaurant })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ commandNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true,  });
          });
      } else {
        res.status(404).json({ commandNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
}