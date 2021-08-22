const router = require('express').Router();

const authRestaurantAdmin = require('../Middlewares/Auth/authRestaurantAdmin');
const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const existTable = require('../Middlewares/Exists/existTable');
const existSlug = require('../Middlewares/Exists/existSlug');
const validatorRestaurant = require('../Middlewares/Validators/validatorRestaurant');
const limits = require('../Middlewares/Limits/limits');
const fileUpload = require('../Middlewares/Uploads/restaurantLogo');
const resizer = require('../Middlewares/Resizer/resizer');

const restoCtrl = require('../Controllers/Restaurants');

router.post('/:idRestaurant/tables', limits(30, 15), existRestaurant, authRestaurantAdmin, restoCtrl.addTable); // Ajoute une nouvelle table

router.put('/:idRestaurant', limits(30, 15), existRestaurant, authRestaurantAdmin, fileUpload, resizer(500, "Images-Resto"), validatorRestaurant, restoCtrl.updateRestaurant); // Modifie un restaurant
router.put('/:idRestaurant/tables/:idTable', limits(30, 15), existRestaurant, existTable, authRestaurantAdmin, restoCtrl.editTable); // Modifie une table

router.get('/:idRestaurant', limits(50, 15), existRestaurant, restoCtrl.getOneRestaurant); // Récupère un restaurant
router.get('/other/search', limits(3000, 15), restoCtrl.searchOneRestaurant); // Rechercher un restaurant
router.get('/:idRestaurant/withMenusAndDishes', limits(50, 15), existRestaurant, restoCtrl.getOneRestaurantWithMenus); // Récupère un restaurant avec ses menus et ses plâts
router.get('/slug/:slug/withMenusAndDishes', limits(50, 15), existSlug, restoCtrl.getOneRestaurantWithMenusWithSlug); // Récupère un restaurant avec ses menus et ses plâts sur base du slug
router.get('/', limits(75, 15), restoCtrl.getAllRestaurant); // Récupère tout les restaurants
router.get('/type/restaurants', limits(75, 15), restoCtrl.getAllRestaurantWithType); // Récupère tout les restaurants avec leurs types
router.get('/most-popular', limits(75, 15), existRestaurant, restoCtrl.getMostPopular); // Récupère les restaurants les plus populaire
router.get('/:idRestaurant/tables', limits(30, 15), existRestaurant, authRestaurantAdmin, restoCtrl.getAllTables); // Récupère toute les tables
router.get('/:idRestaurant/tables/:idTable', limits(30, 15), existRestaurant, existTable, restoCtrl.getOneTable); // Récupère une table

router.delete('/:idRestaurant/tables/:idTable', limits(30, 15), existRestaurant, existTable, authRestaurantAdmin, restoCtrl.deleteOneTable); // Supprime une table

module.exports = router;