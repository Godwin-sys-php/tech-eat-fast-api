const _ = require('underscore');
const checkArrayOptions = require('../../Helpers/checkArrayOptions');
const Menus = require('../../Models/Menus');

module.exports = (req, res, next) => {
  try {

    req.body.options = JSON.parse(req.body.options);
    if (req.method == 'PUT') {
      if (
        req.body.name.length >= 2 &&
        req.body.name.length < 30 &&
        _.isString(req.body.name) &&
        req.body.description.length >= 2 &&
        req.body.description.length < 200 &&
        _.isString(req.body.description) &&
        (parseInt(req.body.price) >= 1000 && _.isNumber(parseInt(req.body.price)) && Number.isInteger(Number(req.body.price))) &&
        checkArrayOptions(req.body, true, req)
      ) {
        Menus.findOne({ idMenu: req.body.idMenu })
          .then(menu => {
            menu ? next() : res.status(400).json({ invalidForm: true });
          })
          .catch(() => {
            res.status(500).json({ error: true, errorMessage: error });
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
        checkArrayOptions(req.body, true, req)
      ) {
        next();
      } else {
        res.status(400).json({ invalidForm: true });
      }
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};