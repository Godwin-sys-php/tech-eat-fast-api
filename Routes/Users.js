const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');
const resizer = require('../Middlewares/Resizer/resizer');

const authUserMostSecure = require('../Middlewares/Auth/authUserMostSecure');

const validatorUsers = require('../Middlewares/Validators/validatorUsers');
const validatorPhoneNumber = require('../Middlewares/Validators/validatorPhoneNumber');
const validatorAddress = require('../Middlewares/Validators/validatorAddress');
const validatorCommandsSaved = require('../Middlewares/Validators/validatorCommandsSaved');

const authUserForRestaurant = require('../Middlewares/Auth/authUserForRestaurant');

const existUser = require('../Middlewares/Exists/existUser');
const existAddress = require('../Middlewares/Exists/existAddress');
const existPhoneNumber = require('../Middlewares/Exists/existPhoneNumber');
const existCommandSaved = require('../Middlewares/Exists/existCommandSaved');

const userCtrl = require('../Controllers/Users');
const verifyTokenUser = require('../Controllers/verifyTokenUser');
const usersPDP = require('../Middlewares/Uploads/usersPDP');

router.post('/signup', limits(20, 15), validatorUsers, userCtrl.signup) ; // Inscrit un utilisateur
router.post('/login', limits(10, 15), userCtrl.login); // Connecte un utilisateur
router.post('/login-no-jwt', limits(10, 15), userCtrl.loginNoJwt); // Connecte un utilisateur sans lui donner un jwt
router.post('/verify-jwt', limits(10, 15), verifyTokenUser); // Connecte un utilisateur sans lui donner un jwt
router.post('/:idUser/address', limits(40, 15), existUser, authUserMostSecure, validatorAddress, userCtrl.addAddress); // Ajoute une addresse à un utilisateur
router.post('/:idUser/phoneNumber', limits(40, 15), existUser, authUserMostSecure, validatorPhoneNumber, userCtrl.addPhoneNumber); // Ajoute un numéro à un utilisateur
router.post('/:idUser/commandsSaved', limits(40, 15), existUser, authUserMostSecure, validatorCommandsSaved, userCtrl.addCommandSaved); // Ajoute une commande pré-enregister à un utilisateur
router.post('/forgot-password', limits(1500, 15), userCtrl.forgotPassword);
router.post('/reset-password/:idUser', limits(1500, 15), existUser, userCtrl.resetPassword);

router.put('/:idUser', limits(100, 15), existUser, authUserMostSecure, validatorUsers, userCtrl.updateOneUser); // Modifie un utilisateur
router.put('/:idUser/profile', limits(40, 15), existUser, authUserMostSecure, usersPDP, resizer(500, "PDP_Users"), userCtrl.changePDP); // Modifie la photo de profile d'un utilisateur
router.put('/:idUser/address/:idAddress', limits(100, 15), existUser, existAddress, authUserMostSecure, validatorAddress, userCtrl.updateAddress); // Modifie une addresse d'un utilisateur
router.put('/:idUser/phoneNumber/:idPhoneNumber', limits(40, 15), existUser, existPhoneNumber, authUserMostSecure, validatorPhoneNumber, userCtrl.updatePhoneNumber); // Modifie un numéro d'un utilisateur

router.get('/:idUser', limits(100, 15), existUser, authUserForRestaurant, userCtrl.getOneUser); // Récupère un utilisateur par lui même ou le restaurant
router.get('/:idUser/commands', limits(100, 15), existUser, authUserMostSecure, userCtrl.getAllCommand); // Récupère les commandes d'un utilisateur
router.get('/:idUser/commands/inProgress', limits(100, 15), existUser, authUserMostSecure, userCtrl.getInProgressCommands); // Récupère les commandes en cours d'un utilisateur
router.get('/:idUser/commands/inProgress/notConnected', limits(100, 15), userCtrl.getInProgressCommandsNotConnected); // Récupère les commandes en cours d'un utilisateur
router.get('/:idUser/commands/timestamp/:begin/:end', limits(100, 15), existUser, authUserMostSecure, userCtrl.getCommandsWithTimestamp); // Récupère les commandes sur une période d'un utilisateur
router.get('/:idUser/address', limits(40, 15), existUser, authUserMostSecure, userCtrl.getAllAddress); // Récupère toutes les addresses d'un utilisateur-&
router.get('/:idUser/phoneNumber', limits(40, 15), existUser, authUserMostSecure, userCtrl.getAllPhoneNumber); // Récupère tout les numéros d'un utilisateur
router.get('/:idUser/commandsSaved', limits(40, 15), existUser, authUserMostSecure, userCtrl.getAllCommandsSaved); // Récupère toute les commandes sauvegardées d'un utilisateur

router.delete('/:idUser', limits(50, 15), existUser, authUserMostSecure, userCtrl.deleteOneUser); // Supprime un utilisateur
router.delete('/:idUser/address/:idAddress', limits(100, 15), existUser, existAddress, authUserMostSecure, userCtrl.deleteOneAddress); // Supprime une addresse d'un utilisateur
router.delete('/:idUser/phoneNumber/:idPhoneNumber', limits(40, 15), existUser, existPhoneNumber, authUserMostSecure, userCtrl.deleteOnePhoneNumber); // Supprime un numéro d'un utilisateur

module.exports = router;