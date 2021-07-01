require('dotenv').config();

const jwt = require('jsonwebtoken');
const UsersRestaurant = require('../Models/UsersRestaurant');

module.exports = (req, res) => {
  try {
    const token = req.body.token;
    const idUserRestaurant = req.body.idUserRestaurant;

    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
      if (err) {
        res.status(400).json({ invalidToken: true });
      } else {
        if (idUserRestaurant == decoded.idUserRestaurant) {
          UsersRestaurant.findOne({ idUserRestaurant: decoded.idUserRestaurant })
            .then(user => {
              user ? res.status(200).json({ validToken: true }) : res.status(400).json({ invalidToken: true });
            })
            .catch(error => {
              res.status(500).json({ error: true,  });
            });
        } else {
          res.status(400).json({ invalidToken: true });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};