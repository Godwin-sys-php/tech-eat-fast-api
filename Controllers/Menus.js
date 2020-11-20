const Menus = require("../Models/Menus");
const Dishes = require("../Models/Dishes");

exports.addMenu = (req, res) => {
  const now = new Date();
  const toInsert = new Menus({
    idRestaurant: req.params.idRestaurant,
    name: req.body.name,
    creationDate: now.toUTCString()
  });

  toInsert.save()
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

  Menus.updateOne({ _id: req.params.idMenu }, toSet)
    .then(() => {
      res.status(200).json({ update: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getMenuOfResto = (req, res) => {
  Menus.find({ idRestaurant: req.params.idRestaurant })
    .then(menus => {
      res.status(200).json({ find: true, result: menus });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}

exports.getOneMenu = (req, res) => {
  Menus.findOne({ _id: req.params.idMenu })
    .then(menu => {
      res.status(200).json({ find: true, result: menu });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.deleteOneMenu = (req, res) => {
  Menus.find() 
    .then(menus => {
      if (menus.length <= 1) {
        res.status(400).json({ cantHaveZeroMenu: true });
      } else {
        Dishes.deleteMany({ idMenu: req.params.idMenu })
          .then(() => {
            Menus.deleteOne({ _id: req.params.idMenu })
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