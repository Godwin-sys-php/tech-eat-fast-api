const Dishes = require("../Models/Dishes");
const moment = require('moment');
const fs = require('fs');

exports.addDish = async (req, res) => {
  const now = moment();

  const toInsert = {
    idRestaurant: req.idRestaurant,
    idMenu: req.params.idMenu,
    name: req.body.name,
    description: req.body.description,
    price: parseInt(req.body.price),
    creationDate: now.unix(),
    imageUrl: `${req.protocol}://${req.get('host')}/Images-Dishes/${req.file.filename}`,
    available: true
  };

  await Dishes.insertOne(toInsert)
    .then(() => {
      res.status(201).json({ create: true })
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.updateDish = (req, res) => {
  if (req.file) {
    const toSet = {
      name: req.body.name,
      idMenu: req.body.idMenu,
      description: req.body.description,
      price: parseInt(req.body.price),
      imageUrl: `${req.protocol}://${req.get("host")}/Images-Dishes/${
        req.file.filename
      }`,
    };

    Dishes.findOne({ idDish: req.params.idDish })
      .then((dish) => {
        const filename = dish.imageUrl.split("/Images-Dishes/")[1];
        fs.unlinkSync(`Images-Dishes/${filename}`);

        Dishes.updateOne(toSet, { idDish: req.params.idDish })
          .then(() => {
            res.status(200).json({ update: true });
          })
          .catch((error) => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  } else {
    const toSet = {
      name: req.body.name,
      idMenu: req.body.idMenu,
      description: req.body.description,
      price: req.body.price,
    };
    Dishes.updateOne(toSet, { idDish: req.params.idDish })
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch((error) => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  }
};

exports.toogleDish = (req, res) => {
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      Dishes.updateOne({ available: !dish.available },req.params.idDish)
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
  Dishes.customQuery('SELECT * FROM dishes WHERE idMenu = ?', [req.params.idMenu])
    .then(dishes => {
      res.status(200).json({ find: true, result: dishes });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getFromRestaurant = (req, res) => {
  Dishes.customQuery('SELECT * FROM dishes WHERE idRestaurant = ?', [req.params.idRestaurant])
    .then(dishes => {
      res.status(200).json({ find: true, result: dishes });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}

exports.getOneDish = (req, res) => {
  Dishes.findOne({ idDish: req.params.idDish })
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
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      const filename = dish.imageUrl.split("/Images-Dishes/")[1];
      fs.unlinkSync(`Images-Dishes/${filename}`);
      
      Dishes.delete({ idDish: req.params.idDish })
        .then(() => {
          res.status(200).json({ delete: true });
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
}
