const router = require('express').Router();

const limits = require('../Middlewares/Limits/limits');

const existRestaurant = require('../Middlewares/Exists/existRestaurant');
const validatorCommand = require('../Middlewares/Validators/validatorCommand');
const existCommand = require('../Middlewares/Exists/existCommand');
const authUserForCommands = require('../Middlewares/Auth/authUserForCommands');
const authRestaurant = require('../Middlewares/Auth/authRestaurant');
const authUserForGetAndDeleteCommand = require('../Middlewares/Auth/authUserForGetAndDeleteCommand');
const authMobile = require('../Middlewares/Auth/authMobile');
const authMobile2 = require('../Middlewares/Auth/authMobile2');

const generator = require('../Controllers/Generator');
const commandCtrl = require('../Controllers/Commands');

router.post('/restaurant/:idRestaurant', limits(50, 15), existRestaurant, authUserForCommands, validatorCommand, commandCtrl.addCommand); // Ajoute une commande sans la payée
router.post('/restaurant/:idRestaurant/andPay', limits(50, 15), existRestaurant, authUserForCommands, authMobile, validatorCommand, commandCtrl.addCommandAndPay); // Ajoute une commande en la payant (+ token)

router.put('/:idCommand/accept', limits(200, 15), existCommand, authRestaurant, commandCtrl.acceptCommand); 
router.put('/:idCommand/refuse', limits(200, 15), existCommand, authRestaurant, commandCtrl.refuseCommand);
// router.put('/:idCommand', limits(200, 15), existCommand, authUser, authUserForUpdateOrDelete, commandCtrl.updateCommand);
router.put('/:idCommand/setReady', limits(200, 15), existCommand, authRestaurant, commandCtrl.setReady, generator);
router.put('/:idCommand/setDone', limits(200, 15), existCommand, authRestaurant, commandCtrl.setDone);

router.get('/restaurant/:idRestaurant/not-done', limits(200, 15), existRestaurant, authRestaurant, commandCtrl.getNotDoneCommand);
router.get('/:idCommand', limits(200, 15), existCommand, authUserForGetAndDeleteCommand, commandCtrl.getOneCommand);
router.get('/:idCommand/notConnected', limits(200, 15), existCommand, commandCtrl.getOneCommandNotConnected);
router.get('/restaurant/:idRestaurant/timestamp/:begin/:end', limits(200, 15), existRestaurant, authRestaurant, commandCtrl.getCommandOfRestaurantWithTimestamp);
router.get('/restaurant/:idRestaurant/report/timestamp/:timestamp', limits(200, 15), existRestaurant, authRestaurant, commandCtrl.getOneDayReport);
router.get('/restaurant/:idRestaurant/report/period/:begin/:end', limits(200, 15), existRestaurant, authRestaurant, commandCtrl.getPeriodReport);

router.get('/:idCommand/pay', limits(50, 15), existCommand, authMobile2, commandCtrl.payCommand); // Paye une commande (+ token)
router.get('/:idCommand/payConfirm', limits(50, 15), existCommand, authMobile2, commandCtrl.payConfirmCommand); // Confirme le paiement d'une commande (+ token)

router.delete('/:idCommand', limits(200, 15), existCommand, authUserForGetAndDeleteCommand, commandCtrl.deleteOneCommand);
router.delete('/:idCommand/notConnected', limits(200, 15), existCommand, commandCtrl.deleteOneCommandNotConnected);

module.exports = router;