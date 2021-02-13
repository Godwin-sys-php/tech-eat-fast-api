const moment = require("moment");
const { getArrayOfDay, getArrayOfBegin, getArrayOfEnd } = require("../../Helpers/stock");
const parse = require('../../Helpers/parseHoursOurMinute');
const Restaurants = require("../../Models/Restaurants");

module.exports = (req, res, next) => {
  Restaurants.findOne({ idRestaurant: req.params.idRestaurant })
    .then(resto => {
      const now = moment();
      let dayOfResto = getArrayOfDay(resto.daysDelivery);
      let beginOfResto = getArrayOfBegin(resto.daysDelivery);
      let endOfResto = getArrayOfEnd(resto.daysDelivery);

      if (dayOfResto.includes(now.day()) && beginOfResto[dayOfResto.indexOf(now.day())] >= `${parse(now.hour())}:${parse(now.minute())}` && endOfResto[dayOfResto.indexOf(now.day())] < `${parse(now.hour())}:${parse(now.minute())}`) {
        
      } else {
        res.status(400).json({ restaurantIsClose: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
};