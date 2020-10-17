const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');

const authUserMostSecure = require('../Middlewares/Auth/authUserMostSecure');
const validatorUsers = require('../Middlewares/Validators/validatorUsers');
const authUserForRestaurant = require('../Middlewares/Auth/authUserForRestaurant');
const existUser = require('../Middlewares/Exists/existUser');

const userCtrl = require('../Controllers/Users');

router.post('/signup', limits(20, 15), validatorUsers, userCtrl.signup) ; // Inscrit un utilisateur
router.post('/login', limits(10, 15), userCtrl.login); // Connecte un utilisateur
router.post('/login-no-jwt', limits(10, 15), userCtrl.loginNoJwt); // Connecte un utilisateur sans lui donner un jwt

router.put('/:idUser', limits(30, 15), existUser, authUserMostSecure, validatorUsers, userCtrl.updateOneUser); // Modifie un utilisateur

router.get('/:idUser', limits(50, 15), existUser, authUserForRestaurant, userCtrl.getOneUser); // Récupère un utilisateur par lui même ou le restaurant
router.get('/:idUser/commands', limits(50, 15), existUser, authUserMostSecure, userCtrl.getAllCommand); // Récupère les commandes d'un utilisateur

router.delete('/:idUser', limits(50, 15), existUser, authUserMostSecure, userCtrl.deleteOneUser); // Supprime un utilisateur

module.exports = router;