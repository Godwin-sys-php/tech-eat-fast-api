exports.getArrayOfDay = (object) => {
  let toReturn = [];
  for (let index in object) {
    toReturn.push(object[index].day);
  }
  return toReturn;
};

exports.getArrayOfBegin = (object) => {
  let toReturn = [];
  for (let index in object) {
    toReturn.push(object[index].begin);
  }
  return toReturn;
};

exports.getArrayOfEnd = (object) => {
  let toReturn = [];
  for (let index in object) {
    toReturn.push(object[index].end);
  }
  return toReturn;
};