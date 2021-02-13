require('dotenv').config();

const jwt = require('jsonwebtoken');
const Users = require('../Models/Users');

module.exports = (req, res) => {
  try {
    const token = req.body.token;
    const idUser = req.body.idUser;

    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
      if (err) {
        res.status(400).json({ invalidToken: true });
      } else {
        if (idUser == decoded.idUserRestaurant) {
          Users.findOne({ idUser: decoded.idUserRestaurant })
            .then(user => {
              user ? res.status(200).json({ validToken: true }) : res.status(400).json({ invalidToken: true });
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        } else {
          res.status(400).json({ invalidToken: true });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};