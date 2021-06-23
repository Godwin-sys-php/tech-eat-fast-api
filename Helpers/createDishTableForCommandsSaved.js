/**
 * Créer un tableau optimisé pour la multiple insertion des plâts dans la bdd. Tout ça pour la les commandes pré-enregistrer
 * @param  {Array} dishes Le tableau des plâts
 * @param  {Number} insertId Le dernier élément insérer (l'id de la commande)
 * @returns {Number} Le total
 */

 module.exports = async (dishes, insertId) => {
   let commandItems = [];
   for (let index in dishes) {
     let el = dishes[index];
     if (el.hasOwnProperty('idOption') && el.idOption !== null) {
       commandItems.push([insertId, el.idDish, el.idOption, el.quantity]);
     } else {
       commandItems.push([insertId, el.idDish, null, el.quantity]);
     }
   }
   return commandItems;
 }