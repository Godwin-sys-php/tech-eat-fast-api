const router = require("express").Router();

const dishCtrl = require('../Controllers/Dishes');

router.get('/', limits, dishCtrl.getAllDishes) // Récupère tout les plats
router.get('/:idDish', limits, existDishes, dishCtrl.getOneDish); // Récupère un plats
router.get('/most-popular', limits, dishCtrl.getMostPopularDishes); // Récupère les plats les plus populaire

module.exports = router;