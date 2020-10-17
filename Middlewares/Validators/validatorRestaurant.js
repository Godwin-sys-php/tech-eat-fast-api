const _ = require('underscore');
const Resto = require('../../Models/Restaurants');
const verifyPaymentMethod = require('../../Helpers/verifyPaymentMethod');

module.exports = (req, res, next) => {
  try {
    let paymentCondition = verifyPaymentMethod(req.body.paymentMethodAccept);

    let condition = ((req.body.name.length >= 2 && req.body.name.length <= 50 && _.isString(req.body.name)) && (req.body.address.length >= 2 && req.body.address.length <= 75 && _.isString(req.body.address)) && (paymentCondition));

    if (condition) {
      Resto.findOne({ name: req.body.name })
        .then(resto => {
          !resto ? next() : res.status(400).json({ existName: true });
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
};