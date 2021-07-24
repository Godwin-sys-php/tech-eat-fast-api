/**
 * Vérifie, valide, modifie le tableau d'options des plâts et crée un noveau tableau formater pour mysql
 * @param  {Object} bodyOfRequest Le form-data de la requête
 * @param  {Boolean} needOptionsArray Le tableau d(options est requit?
 * @param  {Object} req L'objet de la requête
 * @returns {Boolean} Valide ou pas
 */

const _ = require('underscore');

module.exports = (bodyOfRequest, needOptionsArray = true, req) => {
  try {
    if (bodyOfRequest.hasOwnProperty('options') && typeof bodyOfRequest.options === "object") {
      const options = bodyOfRequest.options;
      let newArray = [];
      let newArrayFormat = [];
      for (let index in options) {
        if (
          typeof options[index] === "object" &&
          (options[index].hasOwnProperty('name') && options[index].name.length >= 2 && options[index].name.length <= 30 && _.isString(options[index].name)) &&
          (options[index].hasOwnProperty('price') && (options[index].price) > 0)
        ) {
          if (req.params.idDish) {
            newArray.push({
              idDish: req.params.idDish,
              name: options[index].name,
              price: (options[index].price),
            });
            newArrayFormat.push([options[index].name, options[index].price]);
          } else {
            newArray.push({
              name: options[index].name,
              price: (options[index].price),
            });
            newArrayFormat.push([options[index].name, options[index].price]);
          }
        } else {
          return false;
        }
      }
      bodyOfRequest.options = newArray;
      bodyOfRequest.optionsFormat = newArrayFormat;
      return true;
    } else {
      return needOptionsArray ? false : true;
    }
  } catch (error) {
    return false;
  }
};