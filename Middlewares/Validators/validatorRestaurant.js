const _ = require('underscore');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  try {
    req.body = JSON.parse(req.body.userInfo);

    let condition = ((req.body.name.length >= 2 && req.body.name.length <= 50 && _.isString(req.body.name)) && (req.body.address.length >= 2 && req.body.address.length <= 75 && _.isString(req.body.address)) && req.body.description.length >= 4) &&  _.isBoolean(req.body.acceptCash);
    if (condition) {
      Resto.customQuery('SELECT * FROM restaurants WHERE name= ? AND idRestaurant != ?', [req.body.name, req.params.idRestaurant])
        .then(resto => {
          resto.length > 0 ? res.status(400).json({ existName: true }) : next();
        })
        .catch(error => {
          res.status(500).json({ error: true,  });
        });
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};