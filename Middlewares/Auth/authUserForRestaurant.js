require('dotenv').config();

const jwt= require('jsonwebtoken');
const Users = require('../../Models/Users');
const UsersRestaurant = require('../../Models/UsersRestaurant');
const Restaurants = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const idUser = req.params.idUser;

    const decodedToken = jwt.verify(token, process.env.TOKEN);

    if (decodedToken.idUser && decodedToken.idUser == idUser) {
      Users.findOne({ idUser: req.params.idUser })
        .then(user => {
          if (user) {
            next();
          } else {
            res.status(400).json({ invalidToken: true });
          }
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    } else if (decodedToken.idUserRestaurant) {
      UsersRestaurant.findOne({ idUserRestaurant: decodedToken.idUserRestaurant })
        .then(userRestaurant => {
          Restaurants.findOne({ idRestaurant: userRestaurant.idRestaurant })
            .then(restaurant => {
              if (restaurant) {
                next();
              } else {
                res.status(400).json({ invalidToken: true });
              }
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    } else {
      res.status(400).json({ invalidToken: true });
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};