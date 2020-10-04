const _ = require('underscore');
const Resto = require('../../Models/Restaurants');

module.exports = (req, res, next) => {
  try {
    let paymentCondition = req.body.paymentMethodAccept.includes('CB') || req.body.paymentMethodAccept.includes('m-pesa') || req.body.paymentMethodAccept.includes('airtel-money') || req.body.paymentMethodAccept.includes('orange-money') || req.body.paymentMethodAccept.includes('direct-cash');

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