const Menus = require("../Models/Menus");
const Dishes = require("../Models/Dishes");
const moment = require('moment');

exports.addMenu = (req, res) => {
  const now = moment();
  const toInsert = {
    idRestaurant: req.params.idRestaurant,
    name: req.body.name,
    creationDate: now.unix()
  };

  Menus.insertOne(toInsert)
    .then(() => {
      res.status(201).json({ create: true })
    })
    .catch((error) => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.updateMenu = (req, res) => {
  const toSet = {
    name: req.body.name,
  };

  Menus.updateOne(toSet, { idMenu: req.params.idMenu })
    .then(() => {
      res.status(200).json({ update: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getMenuOfResto = (req, res) => {
  Menus.customQuery('SELECT * FROM menus WHERE idRestaurant = ?', [req.params.idRestaurant])
    .then(menus => {
      res.status(200).json({ find: true, result: menus });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}

exports.getOneMenu = (req, res) => {
  Menus.findOne({ idMenu: req.params.idMenu })
    .then(menu => {
      res.status(200).json({ find: true, result: menu });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.deleteOneMenu = (req, res) => {
  Menus.findAll() 
    .then(menus => {
      if (menus.length <= 1) {
        res.status(400).json({ cantHaveZeroMenu: true });
      } else {
        Dishes.delete({ idMenu: req.params.idMenu })
          .then(() => {
            Menus.delete({ idMenu: req.params.idMenu })
              .then(() => {
                res.status(200).json({ delete: true });
              })
              .catch(error => {
                res.status(500).json({ error: true, errorMessage: error });
              });
          })
          .catch(error => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};