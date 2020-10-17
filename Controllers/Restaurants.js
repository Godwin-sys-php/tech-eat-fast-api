const Restaurants = require("../Models/Restaurants");

exports.updateRestaurant = (req, res) => {
  const toSet = {
    name: req.body.name,
    website: req.body.website,
    address: req.body.address,
    paymentMethodAccept: req.body.paymentMethodAccept
  };

  Restaurants.updateOne({ _id: req.params.idRestaurant }, toSet)
    .then(() => {
      res.status(200).json({ update: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getOneRestaurant = (req, res) => {
  Restaurants.findOne({ _id: req.params.idRestaurant })
    .then(resto => {
      res.status(200).json({ find: true, result: resto })
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getAllRestaurant = (req, res) => {
  Restaurants.find()
    .then(resto => {
      res.status(200).json({ find: true, result: resto })
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getMostPopular = (req, res) => {
  res.status(200).json({ inDev: true });
};