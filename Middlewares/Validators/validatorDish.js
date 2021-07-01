const _ = require('underscore');
const checkArrayOptions = require('../../Helpers/checkArrayOptions');
const checkArrayIngredients = require('../../Helpers/checkArrayIngredients');
const Menus = require('../../Models/Menus');

module.exports = (req, res, next) => {
  try {

    req.body.options = JSON.parse(req.body.options);
    req.body.ingredients = JSON.parse(req.body.ingredients);
    if (req.method == 'PUT') {
      if (
        req.body.name.length >= 2 &&
        req.body.name.length < 30 &&
        _.isString(req.body.name) &&
        req.body.description.length >= 2 &&
        req.body.description.length < 200 &&
        _.isString(req.body.description) &&
        (parseInt(req.body.price) >= 1000 && _.isNumber(parseInt(req.body.price)) && Number.isInteger(Number(req.body.price))) &&
        checkArrayOptions(req.body, false, req) && 
        checkArrayIngredients(req.body.ingredients, req)
      ) {
        Menus.findOne({ idMenu: req.body.idMenu })
          .then(menu => {
            if (req.body.calories && Number.isInteger(Number(req.body.calories))) {
              menu ? next() : res.status(400).json({ invalidForm: true });
            } else {
              res.status(400).json({ invalidForm: true });
            }
          })
          .catch(() => {
            res.status(500).json({ error: true,  });
          });
      } else {
        res.status(400).json({ invalidForm: true });
      }
    } else {
      if (
        req.body.name.length >= 2 &&
        req.body.name.length < 30 &&
        _.isString(req.body.name) &&
        req.body.description.length >= 2 &&
        req.body.description.length < 200 &&
        _.isString(req.body.description) &&
        (parseInt(req.body.price) >= 1000 && _.isNumber(parseInt(req.body.price)) && Number.isInteger(Number(req.body.price))) &&
        checkArrayOptions(req.body, false, req) && 
        checkArrayIngredients(req.body.ingredients, req)
      ) {
        if (req.body.calories && Number.isInteger(Number(req.body.calories))) {
          next();
        } else {
          res.status(400).json({ invalidForm: true });
        }
      } else {
        res.status(400).json({ invalidForm: true });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};