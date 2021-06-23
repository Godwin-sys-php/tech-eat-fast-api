const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.body.token;

    jwt.verify(token, process.env.TOKEN_MOBILE, function(err, decoded) {
      if (!err && decoded.idRestaurant === req.params.idRestaurant) {
        next();
      } else {
        res.status(400).json({ invalidToken: true });
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
}