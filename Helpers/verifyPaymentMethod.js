module.exports = (array) => {
  let good = true;
  if (array.length <= 4 && array.length > 0) {
    for (let index in array) {
      if (!(array[index] === "m-pesa" || array[index] === "airtel-money" || array[index] === "orange-money" || array[index] === "CB")) {
        good = false;
      }
    }
  } else {
    good = false;
  }
  
  return good;
}