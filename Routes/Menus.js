const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');

const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const existMenu = require('../Middlewares/Exists/existMenu');
const authRestaurantMedium = require('../Middlewares/Auth/authRestaurantMedium');
const validatorMenu = require('../Middlewares/Validators/validatorMenu');

const menuCtrl = require('../Controllers/Menus');

router.post('/restaurant/:idRestaurant', limits(300000, 15), existRestaurant, authRestaurantMedium, validatorMenu, menuCtrl.addMenu); // Ajoute un menu
 
router.put('/:idMenu', limits(300000, 15), existMenu, authRestaurantMedium, validatorMenu, menuCtrl.updateMenu); // Modifie un menu

router.get('/restaurant/:idRestaurant', limits(300000, 15), existRestaurant, menuCtrl.getMenuOfResto); // Récupère tout les menus d'un restaurant
router.get('/:idMenu', limits(300000, 15), existMenu, menuCtrl.getOneMenu); // Récupère un menu

router.delete('/:idMenu', limits(300000, 15), existMenu, authRestaurantMedium, menuCtrl.deleteOneMenu); // Supprime un menu

module.exports = router;