module.exports = (object) => {
  let good = true;
  for (let index in object) {
    if (isNaN(object[index])) {
      good = false;
    }
  }
  return good;
};