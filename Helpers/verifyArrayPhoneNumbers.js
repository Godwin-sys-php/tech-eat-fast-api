const _ = require('underscore');

module.exports = (object) => {
  let good = true;
  for (let index in object) {
    let a = parseInt(object[index]);
    
    if (!(a == object[index])) {
      good = false;
    }
  }
  return good;
};