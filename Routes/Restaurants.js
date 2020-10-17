const router = require('express').Router();

const authRestaurantAdmin = require('../Middlewares/Auth/authRestaurantAdmin');
const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const validatorRestaurant = require('../Middlewares/Validators/validatorRestaurant');
const limits = require('../Middlewares/Limits/limits');

const restoCtrl = require('../Controllers/Restaurants');

router.put('/:idRestaurant', limits(30, 15), existRestaurant, authRestaurantAdmin, validatorRestaurant, restoCtrl.updateRestaurant); // Modifie un restaurant

router.get('/:idRestaurant', limits(50, 15), existRestaurant, restoCtrl.getOneRestaurant); // Récupère un restaurant
router.get('/', limits(75, 15), existRestaurant, restoCtrl.getAllRestaurant); // Récupère tout les restaurants
router.get('/most-popular', limits(75, 15), existRestaurant, restoCtrl.getMostPopular); // Récupère les restaurants les plus populaire

module.exports = router;