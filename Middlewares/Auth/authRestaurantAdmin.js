require('dotenv').config();

const jwt= require('jsonwebtoken');
const UserResto = require('../../Models/UsersRestaurant');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const idRestaurant = req.params.idRestaurant;

    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const idUser = decodedToken.idUserRestaurant;
    
    UserResto.findOne({ _id: idUser })
      .then(user => {
        if (user && user.idRestaurant == idRestaurant && (user.level >= 3 && user.level !== 4)) {
          next();
        } else {
          res.status(400).json({ invalidToken: true });
        }
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};