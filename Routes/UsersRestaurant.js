const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');

const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const existUserResto = require('../Middlewares/Exists/existUserRestaurant');
const authRestaurantAdmin = require('../Middlewares/Auth/authRestaurantAdmin');
const authRestaurantAdminForUsers = require('../Middlewares/Auth/authRestaurantAdminForUsers');
const validatorUsersResto = require('../Middlewares/Validators/validatorUserRestaurant');

const userCtrl = require('../Controllers/UsersRestaurant');

router.post('/login', limits(8000, 15), userCtrl.login); // Connecte un utilisateur
router.post('/restaurant/:idRestaurant', limits(8000, 15), existRestaurant, authRestaurantAdmin, validatorUsersResto, userCtrl.addOneUser); // Ajoute un utilisateur à un restaurant, uniquement par l'administrateur du restaurant

router.put('/:idUserResto', limits(8000, 15), existUserResto, authRestaurantAdmin, validatorUsersResto, userCtrl.updateOneUser); // Modifie un utilisateur, uniquement par l'administrateur du restaurant

router.get('/:idUserResto', limits(8000, 15), existUserResto, authRestaurantAdminForUsers, userCtrl.getOneUser); // Récupère un utilisateur, uniquement par l'administrateur du restaurant
router.get('/restaurant/:idRestaurant', limits(8000, 15), existRestaurant, authRestaurantAdmin, userCtrl.getAllUser); // Récupère tout les utilisataur d'un restaurant, uniquement par l'administrateur du restaurant

router.delete('/:idUserResto', limits(8000, 15), existUserResto, authRestaurantAdmin, userCtrl.deleteOneUser); // Supprime un utilisateur, uniquement par l'administrateur du restaurant

module.exports = router;