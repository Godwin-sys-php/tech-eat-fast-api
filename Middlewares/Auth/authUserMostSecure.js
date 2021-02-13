require('dotenv').config();

const jwt= require('jsonwebtoken');
const Users = require('../../Models/Users');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.TOKEN);

    if (req.params.idUser == decodedToken.idUser) {
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
    } else {
      res.status(400).json({ invalidToken: true });
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};