const Restaurants = require("../../Models/Restaurants");

module.exports = (req, res, next) => {
  Restaurants.customQuery("SELECT * FROM tables WHERE idTable = ?", [req.params.idTable])
    .then(user => {
      if (user.length > 0) {
        req.table = user[0];
        next();
      } else {
        res.status(404).json({ tableNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};