const Dishes = require("../Models/Dishes");
const Menus = require("../Models/Menus");
const moment = require('moment');
const fs = require('fs');
const path = require('path');

exports.addDish = async (req, res) => {
  const now = moment();

  const toInsert = {
    idRestaurant: req.idRestaurant,
    idMenu: req.params.idMenu,
    name: req.body.name,
    description: req.body.description,
    price: parseInt(req.body.price),
    creationDate: now.unix(),
    calories: req.body.calories ? req.body.calories : null,
    imageUrl: `${req.protocol}://${req.get("host")}/Images-Dishes/${req.file.filename
      }`,
    available: true,
    needOption: req.body.needOption,
  };

  await Dishes.insertOne(toInsert)
    .then((result) => {
      const insertId = result.insertId;
      if (req.body.hasOwnProperty('options') && typeof req.body.options === "object" && req.body.options.length > 0) {
        for (let index in req.body.optionsFormat) {
          req.body.optionsFormat[index] = [insertId, req.body.optionsFormat[index][0], req.body.optionsFormat[index][1]];
        }
        Dishes.customQuery('INSERT INTO dishOptions (idDish, name, price) VALUES ?', [req.body.optionsFormat])
          .then(() => {
            for (let index in req.arrFormat) {
              req.arrFormat[index] = [insertId, req.arrFormat[index][1]];
            }
            Dishes.customQuery('INSERT INTO dishIngredients (idDish, name) VALUES ?', [req.arrFormat])
              .then(() => {
                res.status(201).json({ create: true });
              })
              .catch(error => {
                console.log('====================================');
                console.log(error);
                console.log('====================================');
                res.status(500).json({ error: true,  });
              });
          })
          .catch(error => {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            res.status(500).json({ error: true,  });
          });
      } else {
        for (let index in req.arrFormat) {
          req.arrFormat[index] = [insertId, req.arrFormat[index][1]];
        }
        Dishes.customQuery('INSERT INTO dishIngredients (idDish, name) VALUES ?', [req.arrFormat])
          .then(() => {
            res.status(201).json({ create: true });
          })
          .catch(error => {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            res.status(500).json({ error: true,  });
          });
      }
    })
    .catch(error => {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json({ error: true,  });
    });
};

exports.updateDish = (req, res) => {
  if (req.file) {
    const toSet = {
      name: req.body.name,
      idMenu: req.body.idMenu,
      description: req.body.description,
      calories: req.body.calories ? req.body.calories : null,
      price: parseInt(req.body.price),
      imageUrl: `${req.protocol}://${req.get("host")}/Images-Dishes/${req.file.filename
        }`,
        needOption: req.body.needOption,
    };

    Dishes.findOne({ idDish: req.params.idDish })
      .then((dish) => {
        const filename = dish.imageUrl.split("/Images-Dishes/")[1];
        fs.unlinkSync(path.join(__dirname, "../Images-Dishes", filename));

        Dishes.updateOne(toSet, { idDish: req.params.idDish })
          .then(() => {

            if (req.body.hasOwnProperty('options') && typeof req.body.options === "object") {
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
                            Dishes.customQuery('SELECT * FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                              .then(ingredients => {
                                if (JSON.stringify(ingredients) !== JSON.stringify(req.body.ingredients)) {
                                  Dishes.customQuery('DELETE FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                                    .then(() => {
                                      for (let index in req.body.ingredients) {
                                        req.body.ingredients[index] = [req.params.idDish, req.body.ingredients[index]];
                                      }
                                      Dishes.customQuery('INSERT INTO dishIngredients (idDish, name) VALUES ?', [req.body.ingredients])
                                        .then(() => {
                                          res.status(201).json({ update: true });
                                        })
                                        .catch(error => {
                                          console.log('====================================');
                                          console.log(error);
                                          console.log('====================================');
                                          res.status(500).json({ error: true,  });
                                        });
                                    })
                                    .catch((error) => {
                                      console.log('====================================');
                                      console.log(error);
                                      console.log('====================================');
                                      res.status(500).json({ error: true,  });
                                    });
                                } else {
                                  res.status(200).json({ update: true });
                                }
                              })
                              .catch((error) => {
                                console.log('====================================');
                                console.log(error);
                                console.log('====================================');
                                res.status(500).json({ error: true,  });
                              });
                          })
                          .catch(error => {
                            console.log('====================================');
                            console.log(error);
                            console.log('====================================');
                            res.status(500).json({ error: true,  });
                          });
                      })
                      .catch((error) => {
                        console.log('====================================');
                        console.log(error);
                        console.log('====================================');
                        res.status(500).json({ error: true,  });
                      });
                  } else {
                    res.status(200).json({ update: true });
                  }
                })
                .catch((error) => {
                  console.log('====================================');
                  console.log(error);
                  console.log('====================================');
                  res.status(500).json({ error: true,  });
                });
            } else {
              Dishes.customQuery('SELECT * FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                .then(ingredients => {
                  if (JSON.stringify(ingredients) !== JSON.stringify(req.body.ingredients)) {
                    Dishes.customQuery('DELETE FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                      .then(() => {
                        for (let index in req.body.ingredients) {
                          req.body.ingredients[index] = [req.params.idDish, req.body.ingredients];
                        }
                        Dishes.customQuery('INSERT INTO dishIngredients (idDish, name) VALUES ?', [req.body.ingredients])
                          .then(() => {
                            res.status(201).json({ update: true });
                          })
                          .catch(error => {
                            res.status(500).json({ error: true,  });
                          });
                      })
                      .catch((error) => {
                        res.status(500).json({ error: true,  });
                      });
                  } else {
                    res.status(200).json({ update: true });
                  }
                })
                .catch((error) => {
                  res.status(500).json({ error: true,  });
                });
            }
          })
          .catch((error) => {
            res.status(500).json({ error: true,  });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: true,  });
      });
  } else {
    const toSet = {
      name: req.body.name,
      idMenu: req.body.idMenu,
      description: req.body.description,
      calories: req.body.calories ? req.body.calories : null,
      price: req.body.price,
      needOption: req.body.needOption,
    };
    Dishes.updateOne(toSet, { idDish: req.params.idDish })
      .then(() => {
        if (req.body.hasOwnProperty('options') && typeof req.body.options === "object") {
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
                        Dishes.customQuery('SELECT * FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                          .then(ingredients => {
                            if (JSON.stringify(ingredients) !== JSON.stringify(req.body.ingredients)) {
                              Dishes.customQuery('DELETE FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                                .then(() => {
                                  for (let index in req.body.ingredients) {
                                    req.body.ingredients[index] = [req.params.idDish, req.body.ingredients[index]];
                                  }
                                  Dishes.customQuery('INSERT INTO dishIngredients (idDish, name) VALUES ?', [req.body.ingredients])
                                    .then(() => {
                                      res.status(201).json({ update: true });
                                    })
                                    .catch(error => {
                                      res.status(500).json({ error: true,  });
                                    });
                                })
                                .catch((error) => {
                                  res.status(500).json({ error: true,  });
                                });
                            } else {
                              res.status(200).json({ update: true });
                            }
                          })
                          .catch((error) => {
                            res.status(500).json({ error: true,  });
                          });
                      })
                      .catch(error => {
                        res.status(500).json({ error: true,  });
                      });
                  })
                  .catch((error) => {
                    res.status(500).json({ error: true,  });
                  });
              } else {
                res.status(200).json({ update: true });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: true,  });
            });
        } else {
          Dishes.customQuery('SELECT * FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
            .then(ingredients => {
              if (JSON.stringify(ingredients) !== JSON.stringify(req.body.ingredients)) {
                Dishes.customQuery('DELETE FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
                  .then(() => {
                    for (let index in req.body.ingredients) {
                      req.body.ingredients[index] = [req.params.idDish, req.body.ingredients[index]];
                    }
                    Dishes.customQuery('INSERT INTO dishIngredients (idDish, name) VALUES ?', [req.body.ingredients])
                      .then(() => {
                        res.status(201).json({ update: true });
                      })
                      .catch(error => {
                        res.status(500).json({ error: true,  });
                      });
                  })
                  .catch((error) => {
                    res.status(500).json({ error: true,  });
                  });
              } else {
                res.status(200).json({ update: true });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: true,  });
            });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: true,  });
      });
  }
};

exports.toogleDish = (req, res) => {
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      Dishes.updateOne({ available: !dish.available }, { idDish: req.params.idDish })
        .then(() => {
          res.status(200).json({ update: true });
        })
        .catch(error => {
          res.status(500).json({ error: true,  });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
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
              res.status(500).json({ error: true,  });
            });
        }
        res.status(200).json({ find: true, result: response });
      } else {
        res.status(200).json({ find: true, result: dishes });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};

exports.getFromRestaurant = async (req, res) => {
  await Dishes.customQuery('SELECT * FROM dishes WHERE idRestaurant = ? ORDER BY idMenu', [req.params.idRestaurant])
    .then(async dishes => {
      let response = [];
      if (dishes.length > 0) {
        for (let index in dishes) {
          await Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [dishes[index].idDish])
            .then(async options => {
              await Dishes.customQuery('SELECT name FROM dishIngredients WHERE idDish= ?', [dishes[index].idDish])
                .then(async ingredients2 => {
                  let ingredients = [];
                  for (let index in ingredients2) {
                    ingredients.push(ingredients2[index].name);
                  }
                  const menu = await Menus.findOne({ idMenu: dishes[index].idMenu });
                  response.push({ ...dishes[index], options: options, ingredients: ingredients, nameMenu: menu.name });
                })
                .catch(error => {
                  res.status(500).json({ error: true,  });
                });
            })
            .catch(error => {
              res.status(500).json({ error: true,  });
            });
        }
        res.status(200).json({ find: true, result: response });
      } else {
        res.status(200).json({ find: true, result: dishes });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
}

exports.getOneDish = (req, res) => {
  Dishes.findOne({ idDish: req.params.idDish })
    .then(dish => {
      Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [req.params.idDish])
        .then(options => {
          Dishes.customQuery('SELECT name FROM dishIngredients WHERE idDish= ?', [req.params.idDish])
            .then(ingredients2 => {
              let ingredients = [];
              for (let index in ingredients2) {
                ingredients.push(ingredients2[index].name);
              }
              res.status(200).json({ find: true, result: { ...dish, options: options, ingredients: ingredients } });
            })
            .catch(error => {
              res.status(500).json({ error: true,  });
            });
        })
        .catch(error => {
          res.status(500).json({ error: true,  });
        });
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
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
      res.status(500).json({ error: true,  });
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
      fs.unlinkSync(path.join(__dirname, "../Images-Dishes", filename));

      Dishes.delete({ idDish: req.params.idDish })
        .then(() => {
          Dishes.customQuery('DELETE FROM dishOptions WHERE idDish= ?', [req.params.idDish])
            .then(() => {
              res.status(200).json({ delete: true });
            })
            .catch(error => {
              res.status(500).json({ error: true,  });
            });
        })
        .catch(error => {
          res.status(500).json({ error: true,  });
        });
    })
}
