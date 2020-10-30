const _ = require('underscore');
const Resto = require('../../Models/Restaurants');
const fs = require('fs');

module.exports = (req, res, next) => {
  try {
    req.body = JSON.parse(req.body.userInfo);

    let condition = ((req.body.name.length >= 2 && req.body.name.length <= 50 && _.isString(req.body.name)) && (req.body.address.length >= 2 && req.body.address.length <= 75 && _.isString(req.body.address)) && req.body.description.length >= 4) &&  _.isBoolean(req.body.acceptCash);

    console.log(req.body);
    if (condition) {
      Resto.findOne({ name: req.body.name, _id: { $ne: req.params.idRestaurant } })
        .then(resto => {
          !resto ? next() : () => { 
            fs.unlinkSync(`Images-Resto/${req.file.filename}`);
            res.status(400).json({ existName: true });
          };
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    } else {
      fs.unlinkSync(`Images-Resto/${req.file.filename}`);
      console.log(req.body.acceptCash);
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    fs.unlinkSync(`Images-Resto/${req.file.filename}`);
    res.status(500).json({ error: true, errorMessage: error });
  }
};