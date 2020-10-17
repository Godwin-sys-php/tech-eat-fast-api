const _ = require('underscore');
const Dishes = require('../../Models/Dishes');

module.exports = (req, res, next) => {
  try {
    if (
      req.body.name.length >= 2 &&
      req.body.name.length < 30 &&
      _.isString(req.body.name) &&
      req.body.description.length >= 2 &&
      req.body.description.length < 200 &&
      _.isString(req.body.description) &&
      (req.body.price >= 100 && _.isNumber(req.body.price)) &&
      _.isArray(req.body.ingredients) &&
      req.body.ingredients.length > 0
    ) {
      next();
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};