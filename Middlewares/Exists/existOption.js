const Dishes = require('../../Models/Dishes');

module.exports = (req, res, next) => {
  Dishes.customQuery('SELECT * FROM dishOptions WHERE idDishOption = ?', req.params.idOption)
    .then(dish => {
      if (dish.length > 0) {
        next();
      } else {
        res.status(404).json({ optionNotFound: true });
      }
    })
    .catch(error => {
      res.status(500).json({ error: true, errorMessage: error });
    });
}