require('dotenv').config();

const jwt = require('jsonwebtoken');
const Menus = require('../../Models/Menus');
const UsersRestaurant = require('../../Models/UsersRestaurant');
const Dishes = require('../../Models/Dishes');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    UsersRestaurant.findOne({ idUserRestaurant: decodedToken.idUserRestaurant })
      .then(user => {
        if (!user) {
          res.status(404).json({ invalidToken: true });
        } else {
          if (decodedToken.idRestaurant == user.idRestaurant && (user.level >= 2 && user.level !== 4)) {
            req.idRestaurant = user.idRestaurant;
            if (req.params.idMenu) {
              Menus.findOne({ idMenu: req.params.idMenu })
                .then(menu => {
                  menu.idRestaurant == decodedToken.idRestaurant ? next() : res.status(403).json({ invalidToken: true });
                })
                .catch(error => {
                  res.status(500).json({ error: true, errorMessage: error });
                });
            } else if (req.params.idRestaurant) {
              req.params.idRestaurant == decodedToken.idRestaurant ? next() : res.status(403).json({ invalidToken: true });
            } else if (req.params.idDish) {
              Dishes.findOne({ idDish: req.params.idDish })
                .then(dish => {
                  dish.idRestaurant == decodedToken.idRestaurant ? next() : res.status(403).json({ invalidToken: true });
                })
                .catch(error => {
                  res.status(500).json({ error: true, errorMessage: error });
                });
            } else {
              next();
            }
          } else {
            res.status(400).json({ invalidToken: true });
          }
        }
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};