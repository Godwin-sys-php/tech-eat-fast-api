require('dotenv').config();

const jwt = require('jsonwebtoken');
const UsersRestaurant = require('../../Models/UsersRestaurant');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);

    if (decodedToken.idUserRestaurant == req.params.idUserResto) {
      next();
    }
    
    UsersRestaurant.findOne({ idUserRestaurant: decodedToken.idUserRestaurant })
      .then(user => {
        if (!user) {
          res.status(404).json({ invalidToken: true });
        } else {
          if (decodedToken.idRestaurant == user.idRestaurant && (user.level >= 3 && user.level !== 4)) {
            UsersRestaurant.findOne({ idUserRestaurant: req.params.idUserResto })
              .then(user => {
                user.idRestaurant == decodedToken.idRestaurant ? next() : res.status(400).json({ invalidToken: true });
              })
              .catch(error => {
                res.status(500).json({ error: true,  });
              });
          } else {
            res.status(400).json({ invalidToken: true });
          }
        }
      })
      .catch(error => {
        res.status(500).json({ error: true,  });
      });
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};