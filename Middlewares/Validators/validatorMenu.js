const _ = require('underscore');
const Menus = require('../../Models/Menus');

module.exports = (req, res, next) => {
  try {
    if (
      req.body.name.length >= 2 &&
      req.body.name.length < 30 &&
      _.isString(req.body.name)
    ) {
      Menus.customQuery('SELECT * FROM menus WHERE name=? AND idRestaurant=?', [req.body.name,req.params.idRestaurant])
        .then((menu) => {
          menu.length > 0 ? res.status(400).json({ existNameMenu: true }) : next();
        })
        .catch((error) => {
          res.status(500).json({ error: true,  });
        });
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};