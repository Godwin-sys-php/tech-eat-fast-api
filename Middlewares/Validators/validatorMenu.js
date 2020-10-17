const _ = require('underscore');
const Menus = require('../../Models/Menus');

module.exports = (req, res, next) => {
  try {
    if (
      req.body.name.length >= 2 &&
      req.body.name.length < 30 &&
      _.isString(req.body.name) &&
      req.body.description.length >= 2 &&
      req.body.description.length < 200 &&
      _.isString(req.body.description)
    ) {
      Menus.findOne({
        name: req.body.name,
        idRestaurant: req.params.idRestaurant,
      })
        .then((menu) => {
          !menu ? next() : res.status(400).json({ existNameMenu: true });
        })
        .catch((error) => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};