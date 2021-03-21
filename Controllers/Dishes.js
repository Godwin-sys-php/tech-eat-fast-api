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
    imageUrl: `${req.protocol}://${req.get("host")}/Images-Dishes/${req.file.filename
      }`,
    available: true
  };

  await Dishes.insertOne(toInsert)
    .then((result) => {
      const insertId = result.insertId;
      for (let index in req.body.optionsFormat) {
        req.body.optionsFormat[index] = [insertId, req.body.optionsFormat[index][0], req.body.optionsFormat[index][1]];
      }
      Dishes.customQuery('INSERT INTO dishOptions (idDish, name, price) VALUES ?', [req.body.optionsFormat])
        .then(() => {
          res.status(201).json({ create: true });
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
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
      imageUrl: `${req.protocol}://${req.get("host")}/Images-Dishes/${req.file.filename
        }`,
    };

    Dishes.findOne({ idDish: req.params.idDish })
      .then((dish) => {
        const filename = dish.imageUrl.split("/Images-Dishes/")[1];
        fs.unlinkSync(`Images-Dishes/${filename}`);

        Dishes.updateOne(toSet, { idDish: req.params.idDish })
          .then(() => {
            Dishes.customQuery('SELECT * FROM dishOptions WHERE idDish= ?', [req.params.idDish])
              .then(options => {
                if (JSON.stringify(options) !== JSON.stringify(req.body.options)) {
                  Dishes.customQuery('DELETE FROM dishOptions WHERE idDish= ?', [req.params.idDish])
                    .then(() => {
                      for (let index in req.body.options) {
                        req.body.options[index] = [req.body.options[index].idDish, req.body.options[index].name, req.body.options[index].price];
                      }
                      Dishes.customQuery('INSERT INTO dishOptions (idDish, name, price) VALUES ?', [req.body.options])
                        .then(() => {
                          res.status(201).json({ update: true });
                        })
                        .catch(error => {
                          res.status(500).json({ error: true, errorMessage: error });
                        });
                    })
                    .catch((error) => {
                      res.status(500).json({ error: true, errorMessage: error });
                    });
                } else {
                  res.status(200).json({ update: true });
                }
              })
              .catch((error) => {
                res.status(500).json({ error: true, errorMessage: error });
              });
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
        Dishes.customQuery('SELECT * FROM dishOptions WHERE idDish= ?', [req.params.idDish])
          .then(options => {
            if (JSON.stringify(options) !== JSON.stringify(req.body.options)) {
              Dishes.customQuery('DELETE FROM dishOptions WHERE idDish= ?', [req.params.idDish])
                .then(() => {
                  for (let index in req.body.options) {
                    req.body.options[index] = [req.body.options[index].idDish, req.body.options[index].name, req.body.options[index].price];
                  }
                  Dishes.customQuery('INSERT INTO dishOptions (idDish, name, price) VALUES ?', [req.body.options])
                    .then(() => {
                      res.status(201).json({ update: true });
                    })
                    .catch(error => {
                      res.status(500).json({ error: true, errorMessage: error });
                    });
                })
                .catch((error) => {
                  res.status(500).json({ error: true, errorMessage: error });
                });
            } else {
              res.status(200).json({ update: true });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: true, errorMessage: error });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: true, errorMessage: error });
      });
  }
};

exports.toogleDish = (req, res) => {
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      Dishes.updateOne({ available: !dish.available }, {idDish: req.params.idDish})
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
      let response = [];
      if (dishes.length > 0) {
        for (let index in dishes) {
          Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [dishes[index].idDish])
            .then(options => {
              response.push({ ...dishes[index], options: options });
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        }
        res.status(200).json({ find: true, result: response });
      } else {
        res.status(200).json({ find: true, result: dishes });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getFromRestaurant = async (req, res) => {
  await Dishes.customQuery('SELECT * FROM dishes WHERE idRestaurant = ?', [req.params.idRestaurant])
    .then(async dishes => {
      let response = [];
      if (dishes.length > 0) {
        for (let index in dishes) {
          await Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [dishes[index].idDish])
            .then(options => {
              response.push({ ...dishes[index], options: options });
            })
            .catch(error => {
              res.status(500).json({ error: true, errorMessage: error });
            });
        }
        res.status(200).json({ find: true, result: response });
      } else {
        res.status(200).json({ find: true, result: dishes });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}

exports.getOneDish = (req, res) => {
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [req.params.idDish])
        .then(options => {
          res.status(200).json({ find: true, result: { ...dish, options: options } });
        })
        .catch(error => {
          res.status(500).json({ error: true, errorMessage: error });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};

exports.getOneOption = (req, res) => {
  Dishes.customQuery('SELECT * FROM dishOptions WHERE idDishOption = ?', req.params.idOption)
    .then(dish => {
      if (dish) {
        res.status(200).json({ find: true, result: dish[0] });
      } else {
        res.status(404).json({ optionNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}

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
          Dishes.customQuery('DELETE FROM dishOptions WHERE idDish= ?', [req.params.idDish])
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
    })
}
