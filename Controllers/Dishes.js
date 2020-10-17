const Dishes = require("../Models/Dishes");

exports.addDish = (req, res) => {
  const now = new Date();

  const toInsert = new Dishes({
    idRestaurant: req.idRestaurant,
    idMenu: req.params.idMenu,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    creationDate: now.toUTCString(),
    ingredients: req.body.ingredients,
    available: true
  });

  toInsert.save()
    .then(res.status(201).json({ create: true }))
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.updateDish = (req, res) => {
  const toSet = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    ingredients: req.body.ingredients
  };

  Dishes.updateOne({ _id: req.params.idDish }, toSet)
    .then(() => {
      res.status(200).json({ update: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.toogleDish = (req, res) => {
  Dishes.findOne({ _id: req.params.idDish })
    .then(dish => {
      Dishes.updateOne({ _id: req.params.idDish }, { available: !dish.available })
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
};

exports.getFromMenu = (req, res) => {
  Dishes.find({ idMenu: req.params.idMenu })
    .then(dishes => {
      res.status(200).json({ find: true, result: dishes });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getOneDish = (req, res) => {
  Dishes.find({ _id: req.params.idDish })
    .then(dish => {
      res.status(200).json({ find: true, result: dish });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getMostPopularFromMenu = (req, res) => {
  res.status(200).json({ inDev: true });
};

exports.getMostPopular = (req, res) => {
  res.status(200).json({ inDev: true });
};

exports.deleteOneDish = (req, res) => {
  Dishes.deleteOne({ _id: req.params.idDish })
    .then(() => {
      res.status(200).json({ delete: true });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}