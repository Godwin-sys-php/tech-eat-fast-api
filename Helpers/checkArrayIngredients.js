/**
 * Vérifie, valide et formate le tableau des ingrédients
 * @param  {Array} arr Le tableau des ingrédients
 * @param  {Object} Request La requête
 */

module.exports = (arr, Request) => {
  let valid = true;
  let newArr = [];
  for (let index in arr) {
    if (!(typeof arr[index] === 'string' && arr[index].length >= 5 && arr[index].length < 300)) {
      valid = false;
      break;
    } else {
      newArr.push([Request.params.idDish, arr[index]]);
    }
  }
  if (valid) {
    Request.arrFormat = newArr;
  }
  return valid;
}