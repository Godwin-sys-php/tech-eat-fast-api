/**
 * Calcul la somme de la commande
 * @param  {Array} dishes Le tableau des plâts
 * @returns {Number} Le total
 */

const Dishes = require('../Models/Dishes');

module.exports = async (dishes) => {
  let total = 0;
  for (let index in dishes) {
    let el = dishes[index];
    if (el.hasOwnProperty('idOption') && el.idOption !== null) {
      const option = await Dishes.customQuery('SELECT * FROM dishOptions WHERE idDishOption = ?', [el.idOption]);
      total += option[0].price * el.quantity;
    } else {
      const dish = await Dishes.findOne({ idDish: el.idDish });
      total += dish.price * el.quantity;
    }
  }
  return total;
}