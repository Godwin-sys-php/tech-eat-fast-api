const Restaurants = require("../Models/Restaurants");
const fs = require('fs');

exports.updateRestaurant = (req, res) => {
  if (req.file) {
    const toSet = {
      name: req.body.name,
      website: req.body.website,
      address: req.body.address,
      description: req.body.description,
      acceptCash: req.body.acceptCash,
      logoUrl: `${req.protocol}://${req.get('host')}/Images-Resto/${req.file.filename}`,
    };

    Restaurants.findOne({ idRestaurant: req.params.idRestaurant })
      .then(resto => {
        const filename = resto.logoUrl.split("/Images-Resto/")[1];
        filename !== "default.jpg" ? fs.unlinkSync(`Images-Resto/${filename}`) : () => { };

        Restaurants.updateOne(toSet, { idRestaurant: req.params.idRestaurant })
          .then(() => {
            res.status(200).json({ update: true });
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  } else {
    const toSet = {
      name: req.body.name,
      website: req.body.website,
      address: req.body.address,
      description: req.body.description,
      acceptCash: req.body.acceptCash,
    };
    Restaurants.updateOne(toSet, { idRestaurant: req.params.idRestaurant })
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch(error => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  }
};

exports.getOneRestaurant = async (req, res) => {
  try {
    const resto = await Restaurants.findOne({ idRestaurant: req.params.idRestaurant });
    const pm = await Restaurants.customQuery('SELECT pm.name FROM PaymentMethodRestaurant pm WHERE pm.idRestaurant = ?', [req.params.idRestaurant]);
    
    const finalPm = pm.map((obj) => obj.name );

    res.status(200).json({ find: true, result: {...resto, paymentMethodAccept: finalPm} })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, errorMessage: error });
  }
};

exports.getAllRestaurant = (req, res) => {
  Restaurants.findAll()
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