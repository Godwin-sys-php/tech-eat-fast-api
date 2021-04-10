/**
 * Créer un tableau optimisé pour la multiple insertion des plâts dans la bdd. Tout ça pour la commande
 * @param  {Array} dishes Le tableau des plâts
 * @param  {Number} insertId Le dernier élément insérer (l'id de la commande)
 * @returns {Number} Le total
 */

const Dishes = require('../Models/Dishes');

module.exports = async (dishes, insertId) => {
  let commandItems = [];
  for (let index in dishes) {
    let el = dishes[index];
    if (el.hasOwnProperty('idOption')) {
      const dish = await Dishes.findOne({ idDish: el.idDish });
      const option = await Dishes.customQuery('SELECT * FROM dishOptions WHERE idDishOption = ?', [el.idOption]);
      commandItems.push([insertId, el.idDish, el.idOption, dish.name, option[0].name, option[0].price, el.quantity]);
    } else {
      const dish = await Dishes.findOne({ idDish: el.idDish });
      commandItems.push([insertId, el.idDish, null, dish.name, null, dish.price, el.quantity]);
    }
  }
  return commandItems;
}