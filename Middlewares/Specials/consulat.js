const Commands = require("../../Models/Commands");
const Dishes = require("../../Models/Dishes");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const idOfCommand = req.insertId;

    const command = await Commands.findOne({ idCommand: idOfCommand });
    const items = await Commands.customQuery("SELECT * FROM commandItems WHERE idCommand = ?", [idOfCommand]);

    const one = await fetch("http://le-consulat-drc.com/sessions", {
      method: 'POST',
      body: JSON.stringify({ nameOfServer: "Exaucée" }),
      headers: {
        'Authorization': 'Bearer token_special_tech-eat-fast',
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const two = await one.json();
    
    for (let index in items) {
      const dishInfo = await Dishes.findOne({...items[index].idDish});

      const init = {
        method: 'PUT',
        body: JSON.stringify({ idProduct: dishInfo.leconsulID, quantity: items[index].quantity, }),
        headers: {
          'Authorization': 'Bearer token_special_tech-eat-fast',
          "Content-type": "application/json; charset=UTF-8"
        }
      };

      await fetch(`http://le-consulat-drc.com/sessions/${two.idInserted}/addItem`, init)

    }

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
    console.log(productOfConsulatRemote);
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
    return res.status(500).json({ error: true });
  }
}