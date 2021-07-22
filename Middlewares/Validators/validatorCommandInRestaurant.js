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
    if (
      (_.isString(req.body.name) && req.body.name.length >= 0 && req.body.name.length < 300) &&
      (_.isString(req.body.comment) && req.body.comment.length >= 0 && req.body.comment.length < 300) &&
      (pm.includes(req.body.paymentMethod)) &&
      (_.isArray(req.body.dishes) && (req.body.dishes.length > 0))
    ) {
      const dishes = req.body.dishes
      for (let index in dishes) {
        if (dishes[index].hasOwnProperty("idDish") && dishes[index].hasOwnProperty("quantity")) {
          const dish = await Dishes.findOne({ idDish: dishes[index].idDish });
          if (dish.needOption === 1 && !dishes[index].hasOwnProperty("idOption")) {
            res.status(400).json({ invalidForm: true });
            break;
          } else {
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
          }
        } else {
          res.status(400).json({ invalidForm: true });
          break;
        }
      }
      next();
    } else {
      res.status(400).json({ invalidForm: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, });
  }
};