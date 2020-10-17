const UsersRestaurant = require('../../Models/UsersRestaurant');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  UsersRestaurant.findOne({ _id: req.params.idUserResto })
    .then(user => {
      if (user) {
        Resto.findOne({ _id: user.idRestaurant })
          .then(resto => {
            if (resto) {
              next();
            } else {
              res.status(404).json({ userNotFound: true });
            }
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      } else {
        res.status(404).json({ userNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}