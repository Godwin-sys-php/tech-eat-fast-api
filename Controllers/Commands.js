const Commands = require("../Models/Commands");
const Restaurants = require("../Models/Restaurants");
const Dishes = require("../Models/Dishes");
const short = require('short-uuid')();
const moment = require('moment');
const calculateSum = require('../Helpers/calculateSum');
const createDishesTable = require('../Helpers/createDishesTable');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.addCommand = async (req, res) => {
  try {
    const now = moment();

    const dishes = req.body.dishes;

    const actualNumber = await Restaurants.customQuery("SELECT number FROM number WHERE idRestaurant = ?", [req.params.idRestaurant]);

    const total = await calculateSum(dishes);

    let toInsertCommand = {
      idRestaurant: req.params.idRestaurant,
      idUser: req.user.idUser,
      orderId: `${moment().format('YY')}-${actualNumber[0].number}`,
      pushToken: req.body.pushToken ? req.body.pushToken : null,
      nameOfClient: req.user.name,
      emailOfClient: req.user.email,
      phoneNumberOfClient: req.user.phoneNumber,
      address: req.body.type === "toTake" ? null : req.body.address,
      reference: req.body.reference ? req.body.reference : null,
      comment: req.body.comment,
      type: req.body.type,
      creationDate: now.unix(),
      lastUpdate: now.unix(),
      total: total,
      paymentMethod: req.body.paymentMethod,
      accept: null,
      status: "inLoading",
    };

    Commands.insertOne(toInsertCommand)
      .then(async result => {
        const insertId = result.insertId;

        try {
          const commandItems = await createDishesTable(dishes, insertId);
          await Commands.customQuery('INSERT INTO commandItems (idCommand, idDish, idOption, nameOfDish, nameOfOption, price, quantity) VALUES ?', [commandItems])
            .then(async (result) => {
              await Restaurants.customQuery("UPDATE number SET number = ? WHERE idRestaurant = ?", [actualNumber[0].number + 1, req.params.idRestaurant]);
              return res.status(201).json({ create: true, insertId: insertId });
            })
            .catch(error => {
              return res.status(500).json({ error: true, });
            });
        } catch (error) {
          return res.status(500).json({ error: true });
        }
      })
      .catch((error) => {
        return res.status(500).json({ error: true });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
}

exports.addCommandInRestaurant = async (req, res) => {
  try {
    const now = moment();

    const dishes = req.body.dishes;

    const actualNumber = await Restaurants.customQuery("SELECT number FROM number WHERE idRestaurant = ?", [req.params.idRestaurant]);

    const dataForTable = await Restaurants.customQuery('SELECT * FROM tables WHERE idTable = ? AND idRestaurant = ?', [req.body.idTable, req.params.idRestaurant]);

    const total = await calculateSum(dishes);

    if (dataForTable.length > 0) {
      const tableId = dataForTable[0].tableId;
      let toInsertCommand = {
        idRestaurant: req.params.idRestaurant,
        idUser: null,
        idTable: req.body.idTable,
        orderId: `${moment().format('YY')}-${actualNumber[0].number}`,
        deviceId: req.body.deviceId,
        pushToken: req.body.pushToken ? req.body.pushToken : null,
        nameOfClient: req.body.name,
        tableId: tableId,
        emailOfClient: null,
        phoneNumberOfClient: null,
        address: null,
        reference: null,
        comment: req.body.comment,
        type: "inRestaurant",
        creationDate: now.unix(),
        lastUpdate: now.unix(),
        total: total,
        paymentMethod: req.body.paymentMethod,
        accept: null,
        status: "inLoading",
      };
  
      Commands.insertOne(toInsertCommand)
        .then(async result => {
          const insertId = result.insertId;
  
          try {
            const commandItems = await createDishesTable(dishes, insertId);
            await Commands.customQuery('INSERT INTO commandItems (idCommand, idDish, idOption, nameOfDish, nameOfOption, price, quantity) VALUES ?', [commandItems])
              .then(async (result) => {
                await Restaurants.customQuery("UPDATE number SET number = ? WHERE idRestaurant = ?", [actualNumber[0].number + 1, req.params.idRestaurant]);
                req.insertId = insertId;
                req.app.get("socketService").broadcastEmiter(req.params.idRestaurant, "new command");
                return res.status(201).json({ create: true, insertId: insertId });
              })
              .catch(error => {
                console.log(error);
                return res.status(500).json({ error: true, });
              });
          } catch (error) {
            console.log(error);
            return res.status(500).json({ error: true });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json({ error: true });
        });
    } else {
      return res.status(400).json({ tableNotFound: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
}

// exports.addCommandAndPay = async (req, res) => {
//   try {
//     if (req.haveToken) {
//       const now = moment();

//       const dishes = req.body.dishes;

//       const total = await calculateSum(dishes);

//       let toInsertCommand = {
//         idRestaurant: req.params.idRestaurant,
//         idUser: req.user.idUser,
//         orderId: uuidv4(),
//         pushToken: req.body.pushToken ? req.body.pushToken : null,
//         nameOfClient: req.user.name,
//         emailOfClient: req.user.email,
//         phoneNumberOfClient: req.body.phoneNumber,
//         address: req.body.type === "toTake" ? null : req.body.address,
//         reference: req.body.reference ? req.body.reference : null,
//         comment: req.body.comment,
//         type: req.body.type,
//         creationDate: now.unix(),
//         lastUpdate: now.unix(),
//         total: total,
//         paymentMethod: req.body.paymentMethod,
//         accept: null,
//         status: "inLoading",
//       };

//       Commands.insertOne(toInsertCommand)
//         .then(async result => {
//           const insertId = result.insertId;

//           try {
//             const commandItems = await createDishesTable(dishes, insertId);
//             await Commands.customQuery('INSERT INTO commandItems (idCommand, idDish, idOption, nameOfDish, nameOfOption, price, quantity) VALUES ?', [commandItems])
//               .then(async (result) => {
//                 return res.status(201).json({ create: true, insertId: insertId });
//               })
//               .catch(error => {
//                 return res.status(500).json({ error: true, });
//               });
//           } catch (error) {
//             return res.status(500).json({ error: true });
//           }
//         })
//         .catch((error) => {
//           return res.status(500).json({ error: true });
//         });
//     } else {
//       const now = moment();

//       const dishes = req.body.dishes;
//       const total = await calculateSum(dishes);

//       let toInsertCommand = {
//         idRestaurant: req.params.idRestaurant,
//         idUser: null,
//         orderId: uuidv4(),
//         nameOfClient: req.body.name,
//         deviceId: req.body.deviceId,
//         pushToken: req.body.pushToken ? req.body.pushToken : null,
//         emailOfClient: null,
//         phoneNumberOfClient: req.body.phoneNumber,
//         address: req.body.type === "toTake" ? null : req.body.address,
//         reference: req.body.reference ? req.body.reference : null,
//         comment: req.body.comment,
//         type: req.body.type,
//         creationDate: now.unix(),
//         lastUpdate: now.unix(),
//         total: total,
//         paymentMethod: req.body.paymentMethod,
//         accept: null,
//         status: "inLoading",
//       };

//       Commands.insertOne(toInsertCommand)
//         .then(async result => {
//           const insertId = result.insertId;
//           console.log(dishes);
//           const commandItems = await createDishesTable(dishes, insertId);

//           Commands.customQuery('INSERT INTO commandItems (idCommand, idDish, idOption, nameOfDish, nameOfOption, price, quantity) VALUES ?', [commandItems])
//             .then(() => {
//               res.status(201).json({ create: true, insertId: insertId });
//             })
//             .catch(error => {
//               res.status(500).json({ error: true,  });
//             });
//         })
//         .catch(() => {
//           res.status(500).json({ error: true });
//         });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: true });
//   }
// }

// exports.payCommand = async (req, res) => {
//   try {
//     const data = await Commands.findOne({ idCommand: req.params.idCommand });
//     if (data.payed) {
//       return res.render('alreadyPayed');
//     } else {
//       const token = jwt.sign({ idCommand: req.params.idCommand }, process.env.TOKEN_MOBILE, {
//         expiresIn: "15min",
//       });
//       const data = {
//         PayType: "MaxiCash",
//         Amount: "500",
//         Currency: "USD",
//         Telephone: "0814461960",
//         Email: "godwinnyembo2@gmail.com",
//         MerchantID: "43fbc30291724be4bababf888a974c63",
//         MerchantPassword: "450108b811294b03aca56a2ec560236d",
//         Language: "Fr",
//         Reference: "LOLCAT",
//         accepturl: `${req.protocol}://${req.get("host")}/commands/${req.params.idCommand}/payConfirm?action=accept&token=${token}`,
//         declineurl: `${req.protocol}://${req.get("host")}/commands/${req.params.idCommand}/payConfirm?action=decline&token=${token}`,
//         cancelurl: `${req.protocol}://${req.get("host")}/commands/${req.params.idCommand}/payConfirm?action=cancel&token=${token}`,
//         notifyurl: ``,
//       };
//       return res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('pay', data);
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: true });
//   }
// }

// exports.payConfirmCommand = async (req, res) => {
//   try {
//     switch (req.query.action) {
//       case 'accept':
//         await Commands.updateOne({ payed: true }, { idCommand: req.params.idCommand });
//         return res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('accept');
//       case 'decline':
//         await Commands.delete({ idCommand: req.params.idCommand });
//         return res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('decline');
//       case 'cancel':
//         await Commands.delete({ idCommand: req.params.idCommand });
//         return res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'").render('cancel');
//     }
//   } catch (error) {
//     res.status(500).json({ error: true });
//   }
// }

exports.acceptCommand = async (req, res, next) => {
  try {
    const now = moment();
    const command = await Commands.findOne({ idCommand: req.params.idCommand });
    if (command.status !== "done") {
      Commands.updateOne({ accept: true, status: "inCooking", lastUpdate: now.unix() }, { idCommand: req.params.idCommand })
        .then(async () => {
          const message = {
            to: command.pushToken,
            sound: 'default',
            title: 'Votre commande a été accepté 😉!',
            body: 'Elle est en cuisine',
            data: { idCommand: command.idCommand, type: command.type },
          };

          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
          if (command.idRestaurant === 2) {
            req.idCommand = command.idCommand;
            return next();
          }
        })
        .catch(error => {
          res.status(500).json({ error: true });
        });
    } else {
      res.status(400).json({ commandAlreadyHaveStatus: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.refuseCommand = async (req, res) => {
  try {
    const now = moment();
    if (req.body.whyRefused.length > 0) {
      const command = await Commands.findOne({ idCommand: req.params.idCommand });
      if (command.status !== "done" && command.status !== "outOfRestaurant" && command.status !== "ready") {
        Commands.updateOne({ accept: false, whyRefused: req.body.whyRefused, lastUpdate: now.unix() }, { idCommand: req.params.idCommand })
          .then(async () => {

            const message = {
              to: command.pushToken,
              sound: 'default',
              title: 'Votre commande a été refusé 🥺!',
              body: req.body.whyRefused,
              data: { idCommand: command.idCommand, type: command.type },
            };

            await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(message),
            });
            return res.status(200).json({ update: true });
          })
          .catch(error => {
            res.status(500).json({ error: true });
          });
      } else {
        res.status(400).json({ commandAlreadyHaveStatus: true });
      }
    } else {
      res.status(400).json({ invalidForm: true, });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
}

exports.setReady = async (req, res, next) => {
  try {
    const now = moment();
    const command = await Commands.findOne({ idCommand: req.params.idCommand });
    const commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [req.params.idCommand]);
    const restoInfo = await Restaurants.findOne({ idRestaurant: command.idRestaurant });

    if (command.status === "inCooking") {
      Commands.updateOne({ accept: true, status: command.type === "toDelive" ? "outOfRestaurant" : "ready", lastUpdate: now.unix() }, { idCommand: req.params.idCommand })
        .then(async () => {
          const message = {
            to: command.pushToken,
            sound: 'default',
            title: command.type === "toDelive" ? "Votre commande est en cours de livraison, patientez un peu ça en vaut la peine 😋" : "Votre commande est prête, vous pouvez venir la chercher 😋",
            body: 'Vous y êtes presque',
            data: { idCommand: command.idCommand, type: command.type },
          };

          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
          req.command = command;
          req.restoInfo = restoInfo;
          req.commandItems = commandItems;
          next();
        })
        .catch(error => {
          res.status(500).json({ error: true });
        });
    } else {
      res.status(400).json({ commandAlreadyHaveStatus: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.setDone = async (req, res) => {
  try {
    const now = moment();
    const command = await Commands.findOne({ idCommand: req.params.idCommand });
    if (command.status === "outOfRestaurant" || command.status === "ready" || !command.accept) {
      Commands.updateOne({ accept: true, status: "done", lastUpdate: now.unix() }, { idCommand: req.params.idCommand })
        .then(async () => {
          const message = {
            to: command.pushToken,
            sound: 'default',
            title: "Votre commande vient d'être clôturer, c'etait un plaisir ❤️ 😋",
            body: "Nous espérons que vous avez aimé le service",
            data: { idCommand: command.idCommand, type: command.type },
          };

          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
          res.status(200).json({ update: true });
        })
        .catch(error => {
          res.status(500).json({ error: true });
        });
    } else {
      res.status(400).json({ commandAlreadyHaveStatus: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.getNotDoneCommand = async (req, res) => {
  try {
    const commands = await Commands.customQuery('SELECT * FROM commands WHERE idRestaurant = ? AND status != "done" ORDER BY lastUpdate DESC', [req.params.idRestaurant]);
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [el.idCommand]);
      response.push({ ...el, items: commandItems });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.getOneCommand = async (req, res) => {
  try {
    const command = await Commands.findOne({ idCommand: req.params.idCommand });

    const commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [req.params.idCommand]);

    let items = [];

    for (let index in commandItems) {
      let dish = await Dishes.findOne({ idDish: commandItems[index].idDish });
      items.push({ ...commandItems[index], dishInfo: dish });
    }

    const restoInfo = await Restaurants.findOne({ idRestaurant: command.idRestaurant });

    res.status(200).json({ find: true, result: { ...command, items: items, restoInfo: restoInfo } });
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.getOneCommandNotConnected = async (req, res) => {
  try {
    const command = await Commands.findOne({ idCommand: req.params.idCommand });

    const commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [req.params.idCommand]);

    let items = [];

    for (let index in commandItems) {
      let dish = await Dishes.findOne({ idDish: commandItems[index].idDish });
      items.push({ ...commandItems[index], dishInfo: dish });
    }

    const restoInfo = await Restaurants.findOne({ idRestaurant: command.idRestaurant });

    if (req.headers.hasOwnProperty('authorization') && req.headers.authorization.split(' ')[1] === command.deviceId) {
      res.status(200).json({ find: true, result: { ...command, items: items, restoInfo: restoInfo } });
    } else {
      res.status(400).json({ invalidToken: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.getCommandOfRestaurantWithTimestamp = async (req, res) => {
  try {
    const commands = await Commands.customQuery('SELECT * FROM commands WHERE idRestaurant = ? AND creationDate > ? AND creationDate <= ? ORDER BY idCommand DESC', [req.params.idRestaurant, req.params.begin, req.params.end]);
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [el.idCommand]);
      response.push({ ...el, items: commandItems, });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.getOneDayReport = async (req, res) => {
  try {
    // Recette
    const recipe = await Commands.customQuery('SELECT SUM(total) as recipe FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ?', [req.params.idRestaurant, req.params.timestamp, Number(req.params.timestamp) + 86400]);

    // Nombre de plâts vendu
    const nbrDishesSell = await Commands.customQuery('SELECT COUNT(ci.idCommandItem) as nbrDishesSell FROM commands c JOIN commandItems ci ON ci.idCommand = c.idCommand WHERE c.idRestaurant = ? AND c.lastUpdate > ? AND c.lastUpdate <= ?', [req.params.idRestaurant, req.params.timestamp, Number(req.params.timestamp) + 86400]);

    // Nombre de commande "toTake"
    const nbrToTakeCommands = await Commands.customQuery('SELECT COUNT(idCommand) as nbrToTakeCommands FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ? AND type="toTake"', [req.params.idRestaurant, req.params.timestamp, Number(req.params.timestamp) + 86400]);

    // Nombre de commande "toDelive"
    const nbrToDeliveCommands = await Commands.customQuery('SELECT COUNT(idCommand) as nbrToDeliveCommands FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ? AND type="toDelive"', [req.params.idRestaurant, req.params.timestamp, Number(req.params.timestamp) + 86400]);

    // Commandes
    const command = await Commands.customQuery('SELECT * FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ? ORDER BY idCommand DESC', [req.params.idRestaurant, req.params.timestamp, Number(req.params.timestamp) + 86400]);
    let commands = [];

    for (let index in command) {
      let el = command[index];
      let commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [el.idCommand]);
      commands.push({ ...el, items: commandItems, });
    }

    res.status(200).json({ find: true, result: { commands: commands, nbrToDeliveCommands: nbrToDeliveCommands[0].nbrToDeliveCommands, nbrToTakeCommands: nbrToTakeCommands[0].nbrToTakeCommands, nbrDishesSell: nbrDishesSell[0].nbrDishesSell, recipe: recipe[0].recipe } });
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.getPeriodReport = async (req, res) => {
  try {
    // Recette
    const recipe = await Commands.customQuery('SELECT SUM(total) as recipe FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ?', [req.params.idRestaurant, req.params.begin, req.params.end]);

    // Nombre de plâts vendu
    const nbrDishesSell = await Commands.customQuery('SELECT COUNT(ci.idCommandItem) as nbrDishesSell FROM commands c JOIN commandItems ci ON ci.idCommand = c.idCommand WHERE c.idRestaurant = ? AND c.lastUpdate > ? AND c.lastUpdate <= ?', [req.params.idRestaurant, req.params.begin, req.params.end]);

    // Nombre de commande "toTake"
    const nbrToTakeCommands = await Commands.customQuery('SELECT COUNT(idCommand) as nbrToTakeCommands FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ? AND type="toTake"', [req.params.idRestaurant, req.params.begin, req.params.end]);

    // Nombre de commande "toDelive"
    const nbrToDeliveCommands = await Commands.customQuery('SELECT COUNT(idCommand) as nbrToDeliveCommands FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ? AND type="toDelive"', [req.params.idRestaurant, req.params.begin, req.params.end]);

    // Commandes
    const command = await Commands.customQuery('SELECT * FROM commands WHERE idRestaurant = ? AND lastUpdate > ? AND lastUpdate <= ? ORDER BY idCommand DESC', [req.params.idRestaurant, req.params.begin, req.params.end]);
    let commands = [];

    for (let index in command) {
      let el = command[index];
      let commandItems = await Commands.customQuery('SELECT * FROM commandItems WHERE idCommand = ?', [el.idCommand]);
      commands.push({ ...el, items: commandItems, });
    }

    res.status(200).json({ find: true, result: { commands: commands, nbrToDeliveCommands: nbrToDeliveCommands[0].nbrToDeliveCommands, nbrToTakeCommands: nbrToTakeCommands[0].nbrToTakeCommands, nbrDishesSell: nbrDishesSell[0].nbrDishesSell, recipe: recipe[0].recipe } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
}

exports.deleteOneCommand = async (req, res) => {
  try {
    const command = await Commands.findOne({ idCommand: req.params.idCommand });
    if (command.status === "inLoading" && command.accept === null) {
      Commands.delete({ idCommand: req.params.idCommand })
        .then(() => {
          res.status(200).json({ delete: true });
        })
        .catch(error => {
          res.status(500).json({ error: true });
        });
    } else {
      res.status(400).json({ commandAlreadyHaveStatus: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}

exports.deleteOneCommandNotConnected = async (req, res) => {
  try {
    const command = await Commands.findOne({ idCommand: req.params.idCommand });
    if (command.status === "inLoading" && command.accept === null) {
      if (req.headers.hasOwnProperty('authorization') && req.headers.authorization.split(' ')[1] === command.deviceId) {
        Commands.delete({ idCommand: req.params.idCommand })
          .then(() => {
            res.status(200).json({ delete: true });
          })
          .catch(error => {
            res.status(500).json({ error: true });
          });
      } else {
        res.status(400).json({ invalidToken: true });
      }
    } else {
      res.status(400).json({ commandAlreadyHaveStatus: true });
    }
  } catch (error) {
    res.status(500).json({ error: true });
  }
}
