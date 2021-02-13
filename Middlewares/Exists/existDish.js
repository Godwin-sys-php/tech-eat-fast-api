const Dishes = require('../../Models/Dishes');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      if (dish) {
        Resto.findOne({ idRestaurant: dish.idRestaurant })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ dishNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(404).json({ dishNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}