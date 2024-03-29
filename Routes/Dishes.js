const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');

const existMenu = require('../Middlewares/Exists/existMenu');
const authRestaurantMedium = require('../Middlewares/Auth/authRestaurantMedium');
const validatorDish = require('../Middlewares/Validators/validatorDish');
const existDish = require('../Middlewares/Exists/existDish');
const existOption = require('../Middlewares/Exists/existOption');
const fileUpload = require('../Middlewares/Uploads/dishesImageForUpdate');
const fileUpload2 = require('../Middlewares/Uploads/dishesImage');
const resizer = require('../Middlewares/Resizer/resizer');

const dishCtrl = require('../Controllers/Dishes');
const existRestaurant = require('../Middlewares/Exists/existRestaurant');

router.post('/menus/:idMenu', limits(80, 15), existMenu, authRestaurantMedium, validatorDish, fileUpload2, resizer(500, "Images-Dishes"), dishCtrl.addDish); // Ajoute un plats à un menu

router.put('/:idDish', limits(80, 15), existDish, authRestaurantMedium, validatorDish, fileUpload, resizer(500, "Images-Dishes"), dishCtrl.updateDish); // Modifie un plats
router.put('/:idDish/toogle', limits(80, 15), existDish, authRestaurantMedium, dishCtrl.toogleDish); // Rends un plats disponible ou indisponible

router.get('/menus/:idMenu', limits(800, 15), existMenu, dishCtrl.getFromMenu); // Récupère tout les plats d'un menu
router.get('/restaurant/:idRestaurant', limits(800, 15), existRestaurant, dishCtrl.getFromRestaurant); // Récupère tout les plats d'un menu
router.get('/:idDish', limits(800, 15), existDish, dishCtrl.getOneDish); // Récupère un plats
router.get('/options/:idOption', limits(800, 15), existOption, dishCtrl.getOneOption); // Récupère une option
router.get('/menus/:idMenu/most-popular', limits(800, 15), existMenu, dishCtrl.getMostPopularFromMenu); // Récupère les plats les plus populaire d'un menu
router.get('/most-popular', limits(800, 15), dishCtrl.getMostPopular); // Récupère les plats les plus populaire

router.delete('/:idDish', limits(80, 15), existDish, authRestaurantMedium, dishCtrl.deleteOneDish); // Supprime un plats

module.exports = router;