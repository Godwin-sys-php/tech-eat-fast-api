const router = require('express').Router();

const authRestaurantAdmin = require('../Middlewares/Auth/authRestaurantAdmin');
const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const validatorRestaurant = require('../Middlewares/Validators/validatorRestaurant');
const limits = require('../Middlewares/Limits/limits');
const fileUpload = require('../Middlewares/Uploads/restaurantLogo');

const restoCtrl = require('../Controllers/Restaurants');

router.put('/:idRestaurant', limits(30, 15), existRestaurant, authRestaurantAdmin, fileUpload, validatorRestaurant, restoCtrl.updateRestaurant); // Modifie un restaurant

router.get('/:idRestaurant', limits(50, 15), existRestaurant, restoCtrl.getOneRestaurant); // Récupère un restaurant
router.get('/other/search', limits(3000, 15), restoCtrl.searchOneRestaurant); // Rechercher un restaurant
router.get('/:idRestaurant/withMenusAndDishes', limits(50, 15), existRestaurant, restoCtrl.getOneRestaurantWithMenus); // Récupère un restaurant avec ses menus et ses plâts
router.get('/', limits(75, 15), restoCtrl.getAllRestaurant); // Récupère tout les restaurants
router.get('/type/restaurants', limits(75, 15), restoCtrl.getAllRestaurantWithType); // Récupère tout les restaurants avec leurs types
router.get('/most-popular', limits(75, 15), existRestaurant, restoCtrl.getMostPopular); // Récupère les restaurants les plus populaire

module.exports = router;