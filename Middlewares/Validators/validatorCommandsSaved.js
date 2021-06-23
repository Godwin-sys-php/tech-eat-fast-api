const Restaurants = require('../../Models/Restaurants');
const Dishes = require('../../Models/Dishes');
const _ = require('underscore');

module.exports = async (req, res, next) => {
  try {
    const pm2 = await Restaurants.customQuery('SELECT pm.name FROM PaymentMethodRestaurant pm WHERE pm.idRestaurant = ?', [req.params.idRestaurant]);
    let pm = [];
    pm2.forEach((el) => { pm.push(el.name); })
    if (req.resto.acceptCash) {
      pm.push("cash");
    }
    if (req.body.type === 'toDelive') {
      if (
        (Number.isInteger(Number(req.body.phoneNumber)) && !isNaN(Number(req.body.phoneNumber))) &&
        (_.isString(req.body.address) && req.body.address.length >= 5 && req.body.address.length < 300) &&
        (_.isString(req.body.comment) && req.body.comment.length >= 0 && req.body.comment.length < 300) &&
        (_.isString(req.body.type) && (req.body.type === 'toTake' || req.body.type === 'toDelive')) &&
        (pm.includes(req.body.paymentMethod)) &&
        (_.isArray(req.body.dishes) && (req.body.dishes.length > 0)) &&
        (Number.isInteger(req.body.idRestaurant)) &&
        (req.body.name.length >= 1 && req.body.name.length < 100 && _.isString(req.body.name))
      ) {
        const dishes = req.body.dishes
        for (let index in dishes) {
          if (dishes[index].hasOwnProperty("idDish") && dishes[index].hasOwnProperty("quantity")) {
            const dish = await Dishes.findOne({ idDish: dishes[index].idDish });
            const options2 = await Dishes.customQuery("SELECT * FROM dishOptions WHERE idDish = ?", [dishes[index].idDish]);
            let options = [];
            options2.forEach(option => { options.push(option.idDishOption) });
Ò
            if (dish && dish.idRestaurant == req.params.idRestaurant) {
              if (dishes[index].hasOwnProperty("idOption")) {
                if (options.includes(dishes[index].idOption)) {
                  continue;
                } else {
                  res.status(400).json({ invalidFormDishes: true });
                  break;
                }
              } else {
                continue;
              }
            } else {
              res.status(400).json({ invalidFormDishes: true });
              break;
            }
          } else {
            res.status(400).json({ invalidForm: true });
            break;
          }
        }
        const restaurant = await Restaurants.findOne({ idRestaurant: req.body.idRestaurant });
        restaurant ? next() : res.status(400).json({ invalidForm: true });
      } else {
        res.status(400).json({ invalidForm: true });
      }
    } else if (req.body.type === 'toTake') {
      if (
        (Number.isInteger(Number(req.body.phoneNumber)) && !isNaN(Number(req.body.phoneNumber))) &&
        (_.isString(req.body.comment) && req.body.comment.length >= 0 && req.body.comment.length < 300) &&
        (_.isString(req.body.type) && (req.body.type === 'toTake' || req.body.type === 'toDelive')) &&
        (pm.includes(req.body.paymentMethod)) &&
        (_.isArray(req.body.dishes) && (req.body.dishes.length > 0)) &&
        (Number.isInteger(req.body.idRestaurant)) &&
        (req.body.name.length >= 1 && req.body.name.length < 100 && _.isString(req.body.name))
      ) {
        const dishes = req.body.dishes
        for (let index in dishes) {
          if (dishes[index].hasOwnProperty("idDish") && dishes[index].hasOwnProperty("quantity")) {
            const dish = await Dishes.findOne({ idDish: dishes[index].idDish });
            const options2 = await Dishes.customQuery("SELECT * FROM dishOptions WHERE idDish = ?", [dishes[index].idDish]);
            let options = [];
            options2.forEach(option => { options.push(option.idDishOption) });

            if (dish && dish.idRestaurant == req.params.idRestaurant) {
              if (dishes[index].hasOwnProperty("idOption")) {
                if (options.includes(dishes[index].idOption)) {
                  continue;
                } else {
                  res.status(400).json({ invalidFormDishes: true });
                  break;
                }
              } else {
                continue;
              }
            } else {
              res.status(400).json({ invalidFormDishes: true });
              break;
            }
          } else {
            res.status(400).json({ invalidForm: true });
            break;
          }
        }
        const restaurant = await Restaurants.findOne({ idRestaurant: req.body.idRestaurant });
        restaurant ? next() : res.status(400).json({ invalidForm: true });
      } else {
        res.status(400).json({ invalidForm: true });
      }
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, });
  }
};