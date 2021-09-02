const Restaurants = require("../Models/Restaurants");
const Menus = require("../Models/Menus");
const Dishes = require("../Models/Dishes");
const fs = require('fs');
const fetch = require('node-fetch');
const RestaurantsFeedBack = require("../Models/RestaurantsFeedBack");

exports.addTable = async (req, res) => {
  try {
    if (req.body.tableId.length > 2) {
      const toInsert = {
        idRestaurant: req.params.idRestaurant, 
        tableId: req.body.tableId
      };
  
      await Restaurants.customQuery('INSERT INTO tables SET ?', toInsert);
      return res.status(200).json({ create: true })
    } else {
      return res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    return res.status(500).json({ error: true })
  }
}

exports.addFeedBack = async (req, res) => {
  try {
    if (req.body.content.length > 2) {
      const toInsert = {
        idRestaurant: req.params.idRestaurant, 
        nameOfClient: req.body.nameOfClient,
        contact: req.body.contact,
        content: req.body.content,
      };
  
      await RestaurantsFeedBack.insertOne(toInsert);
      return res.status(200).json({ create: true })
    } else {
      return res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    return res.status(500).json({ error: true })
  }
}
 
exports.updateRestaurant = (req, res) => {
  if (req.file) {
    const toSet = {
      name: req.body.name,
      website: req.body.website,
      address: req.body.address,
      description: req.body.description,
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
            console.log(error);
            res.status(500).json({ error: true,  });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: true,  });
      });
  } else {
    const toSet = {
      name: req.body.name,
      website: req.body.website,
      address: req.body.address,
      description: req.body.description,
    };
    Restaurants.updateOne(toSet, { idRestaurant: req.params.idRestaurant })
      .then(() => {
        res.status(200).json({ update: true });
      })
      .catch(error => {
        res.status(500).json({ error: true,  });
      });
  }
};

exports.editTable = async (req, res) => {
  try {
    if (req.body.tableId.length > 2 && req.table.idRestaurant == req.params.idRestaurant) {
      const toInsert = {
        tableId: req.body.tableId
      };
  
      await Restaurants.customQuery('UPDATE tables SET ? WHERE idTable = ?', [toInsert, req.params.idTable]);
      return res.status(200).json({ update: true })
    } else {
      return res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    return res.status(500).json({ error: true });
  }
}
 
exports.getOneRestaurant = async (req, res) => {
  try {
    const resto = await Restaurants.customQuery('SELECT r.*, t.name AS type FROM restaurants r LEFT JOIN restaurantsType t ON r.idType = t.idType WHERE r.idRestaurant = ?', [req.params.idRestaurant]);
    const pm = await Restaurants.customQuery('SELECT pm.name FROM PaymentMethodRestaurant pm WHERE pm.idRestaurant = ?', [req.params.idRestaurant]);
    
    const finalPm = pm.map((obj) => obj.name );

    res.status(200).json({ find: true, result: {...resto[0], paymentMethodAccept: finalPm} });
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
};

exports.getFeedBacks = async (req, res) => {
  try {
    const feedbacks = await RestaurantsFeedBack.customQuery("SELECT * FROM `restaurantsFeedback` WHERE idRestaurant = ?", [req.params.idRestaurant]);
    return res.status(200).json({ find: true, result: feedbacks, });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ error: true, });
  }
}

exports.getAllRestaurant = (req, res) => {
  Restaurants.findAll()
    .then(resto => {
      res.status(200).json({ find: true, result: resto })
    })
    .catch(error => {
      res.status(500).json({ error: true,  });
    });
};

exports.getOneRestaurantWithMenus = async (req, res) => {
  try {
    let newMenus = [];


    const restoInfo = await Restaurants.findOne({ idRestaurant: req.resto.idRestaurant });
    const menus = await Menus.customQuery('SELECT name, idMenu FROM menus WHERE idRestaurant = ?', [req.params.idRestaurant]);

    for (let index in menus) {
      let until = await Dishes.customQuery('SELECT * FROM dishes WHERE idMenu = ?', [menus[index].idMenu]);
      newMenus.push({ ...menus[index], dishes: until });
    }

    if (newMenus.length > 0) {
      for (let index in newMenus) {
        if (newMenus[index].dishes.length > 0) {
          for (let i in newMenus[index].dishes) {
            let options = await Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [newMenus[index].dishes[i].idDish]);
            newMenus[index].dishes[i] = {...newMenus[index].dishes[i], options: options};
          }
        }
      }
    }

    res.status(200).json({ find: true, result: {restoInfo: restoInfo, menus: newMenus} });
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
}

exports.getOneRestaurantWithMenusWithSlug= async (req, res) => {
  try {
    let newMenus = [];

    const restoInfo = await Restaurants.findOne({ idRestaurant: req.resto.idRestaurant });
    const menus = await Menus.customQuery('SELECT name, idMenu FROM menus WHERE idRestaurant = ?', [req.resto.idRestaurant]);

    for (let index in menus) {
      let until = await Dishes.customQuery('SELECT * FROM dishes WHERE idMenu = ?', [menus[index].idMenu]);
      newMenus.push({ ...menus[index], dishes: until });
    }

    if (newMenus.length > 0) {
      for (let index in newMenus) {
        if (newMenus[index].dishes.length > 0) {
          for (let i in newMenus[index].dishes) {
            let options = await Dishes.customQuery('SELECT idDishOption, name, price FROM dishOptions WHERE idDish= ?', [newMenus[index].dishes[i].idDish]);
            newMenus[index].dishes[i] = {...newMenus[index].dishes[i], options: options};
          }
        }
      }
    }

    res.status(200).json({ find: true, result: {restoInfo: restoInfo, menus: newMenus} });
  } catch (error) {
    res.status(500).json({ error: true,  });
  }
}

exports.searchOneRestaurant = async (req, res) => {
  try {
    const query = `%${req.query.query}%`;

    const restaurants = await Menus.customQuery('SELECT r.*, t.name AS type FROM restaurants r LEFT JOIN restaurantsType t ON r.idType = t.idType WHERE r.name LIKE ? OR t.name LIKE ? OR r.address LIKE ? OR r.description LIKE ?', [query, query, query, query]);

    res.status(200).json({ find: true, result: restaurants, query: req.query.query });
  } catch (error) {
    res.status(500).json({ error: true,  });
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
    res.status(500).json({ error: true,  });
  }
}

exports.getMostPopular = (req, res) => {
  res.status(200).json({ inDev: true });
};

exports.getAllTables = async (req, res) => {
  try {
    const data = await Restaurants.customQuery('SELECT * FROM tables WHERE idRestaurant = ?', [req.params.idRestaurant]);

    return res.status(200).json({ find: true, result: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true });
  }
}

exports.getOneTable = async (req, res) => {
  try {
    const data = await Restaurants.customQuery('SELECT * FROM tables WHERE idTable = ? AND idRestaurant = ?', [req.params.idTable, req.params.idRestaurant]);
    console.log([req.params.idTable, req.params.idRestaurant]);
    return res.status(200).json({ find: true, result: data[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true });
  }
}

exports.refreshConsulat = async (req, res) => {

  try {
    const init = {
      method: "GET",
      headers: {
        'Authorization': 'Bearer token_special_tech-eat-fast', 
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const begin = await fetch(`http://le-consulat-drc.com/api/products`, init);
    const other = await begin.json();
    const productOfConsulatRemote = other.result;
    const productsOfConsulatLocal = await Dishes.customQuery("SELECT * FROM dishes WHERE idRestaurant = 2", []);
    
    for (let index in productsOfConsulatLocal) {
      if (productsOfConsulatLocal[index].leconsulID !== null) {
        for (let i in productOfConsulatRemote) {
          if (productOfConsulatRemote[i].idProduct === productsOfConsulatLocal[index].leconsulID) {
            if (productOfConsulatRemote[i].inStock >= 1) {
              await Dishes.updateOne({ available: true }, { idDish: productsOfConsulatLocal[index].idDish });
            } else {
              await Dishes.updateOne({ available: false }, { idDish: productsOfConsulatLocal[index].idDish });
            }
          }
          continue;
        }
      }
      continue;
    }
  
    return res.status(200).json({ update: true });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ error: true });
  }

}

exports.deleteOneTable = async (req, res) => {
  try {
    if (req.table.idRestaurant == req.params.idRestaurant) {
  
      await Restaurants.customQuery('DELETE FROM tables WHERE idTable = ?', [req.params.idTable]);
      return res.status(200).json({ delete: true })
    } else {
      console.log(req.table);
      return res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true });
  }
}