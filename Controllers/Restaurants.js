const Restaurants = require("../Models/Restaurants");
const Menus = require("../Models/Menus");
const Dishes = require("../Models/Dishes");
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
    const resto = await Restaurants.customQuery('SELECT r.*, t.name AS type FROM restaurants r LEFT JOIN restaurantsType t ON r.idType = t.idType WHERE r.idRestaurant = ?', [req.params.idRestaurant]);
    const pm = await Restaurants.customQuery('SELECT pm.name FROM PaymentMethodRestaurant pm WHERE pm.idRestaurant = ?', [req.params.idRestaurant]);
    
    const finalPm = pm.map((obj) => obj.name );

    res.status(200).json({ find: true, result: {...resto[0], paymentMethodAccept: finalPm} });
  } catch (error) {
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

exports.getOneRestaurantWithMenus = async (req, res) => {
  try {
    let newMenus = [];

    const restoInfo = await Restaurants.findOne({ idRestaurant: req.params.idRestaurant });
    const menus = await Menus.customQuery('SELECT name, idMenu FROM menus WHERE idRestaurant = ?', [req.params.idRestaurant]);

    for (let index in menus) {
      let until = await Dishes.customQuery('SELECT * FROM dishes WHERE idMenu = ?', [menus[index].idMenu]);
      newMenus.push({ ...menus[index], dishes: until });
    }

    res.status(200).json({ find: true, result: {restoInfo: restoInfo, menus: newMenus} });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
}

exports.searchOneRestaurant = async (req, res) => {
  try {
    const query = `%${req.query.query}%`;

    const restaurants = await Menus.customQuery('SELECT r.*, t.name AS type FROM restaurants r LEFT JOIN restaurantsType t ON r.idType = t.idType WHERE r.name LIKE ? OR t.name LIKE ? OR r.address LIKE ? OR r.description LIKE ?', [query, query, query, query]);

    res.status(200).json({ find: true, result: restaurants, query: req.query.query });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
}

exports.getAllRestaurantWithType = async (req, res) => {
  try {
    let response = [];
    const types = await Restaurants.customQuery('SELECT t.name AS nameOfType, t.color AS colorOfType, t.colorText AS textColorOfType, idType FROM restaurantsType t', []);

    for (let index in types) {
      let until = await Restaurants.customQuery('SELECT * FROM restaurants WHERE idType = ?', [types[index].idType]);
      response.push({ ...types[index], restaurants: until });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true, errorMessage: error });
  }
}

exports.getMostPopular = (req, res) => {
  res.status(200).json({ inDev: true });
};