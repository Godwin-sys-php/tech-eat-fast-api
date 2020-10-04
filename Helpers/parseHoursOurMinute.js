/**
 * Ajoute un 0 au début d'une heure ou d'une minute si elle est supérieur à 9
 * @param  {Number} time La minute ou l'heure
 * @returns {Number} La nouvelle heure ou minute
 */
module.exports = (time) => {
  if (time > 9) {
    return time;
  } else {
    return '0' + time;
  }
}