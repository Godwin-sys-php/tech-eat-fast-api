const Menus = require('../../Models/Menus');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  Menus.findOne({ _id: req.params.idMenu })
    .then(menu => {
      if (menu) {
        Resto.findOne({ _id: menu.idRestaurant, valid: true })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ menuNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(404).json({ menuNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}