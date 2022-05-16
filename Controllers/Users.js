const Users = require("../Models/Users");
const Commands = require("../Models/Commands");
const Restaurants = require("../Models/Restaurants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const passwordValidator = require("password-validator");
const createDishTableForCommandsSaved = require("../Helpers/createDishTableForCommandsSaved");
const sendSms = require("../Utils/sendSms");

require("dotenv").config();

exports.signup = async (req, res) => {
  const now = moment();
  const hash = await bcrypt.hash(req.body.password, 10);
  const toInsert = {
    name: req.body.name,
    username: req.body.username,
    phoneNumber: req.body.phoneNumber,
    creationDate: now.unix(),
    pdpUrl: `${req.protocol}://${req.get("host")}/PDP_Users/default.jpg`,
    password: hash,
    activate: true,
  };
  Users.insertOne(toInsert)
    .then((result) => {
      const toInsert = {
        idUser: result.insertId,
        phoneNumber: req.body.phoneNumber,
      };

      Users.customQuery("INSERT INTO usersPhoneNumber SET ?", [toInsert])
        .then(async () => {
          const now2 = moment();
          const code = Math.floor(1000 + Math.random() * 9000);
          // await sendSms(req.body.phoneNumber.substring(1), "Votre code de confirmation Tech'Eat Fast est " + code.toString());
          await Users.updateOne({ sendDate: now2.unix(), codeSended: code.toString() }, { idUser: result.insertId })
          return res.status(200).json({ create: true });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: true });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: true });
    });
};

exports.activateAccount = async (req, res) => {
  if (req.body.phoneNumber && req.body.code) {
    const user = await Users.findOne({ phoneNumber: req.body.phoneNumber, });
    if (!user) {
      return res.status(404).json({ userNotFound: true });
    } else {
      const now = moment();
      if (user.sendDate + 900 >= now.unix()) {
        if (user.codeSended === req.body.code) {
          await Users.updateOne({ activate: true, }, {phoneNumber: req.body.phoneNumber});
          return res.status(200).json({ activate: true, });
        }
        return res.status(400).json({ invalidCode: true, })
      } else {
        const now2 = moment();
        const code = Math.floor(1000 + Math.random() * 9000);
        await sendSms(req.body.phoneNumber.substring(1), "Votre code de confirmation Tech'Eat Fast est " + code.toString());
        await Users.updateOne({ sendDate: now2.unix(), codeSended: code.toString() }, {phoneNumber: req.body.phoneNumber})

        return res.status(400).json({ codeExpired: true, });
      }
    }
  } else {
    return res.status(400).json({ invalidForm: true, });
  }
}

exports.resendCode = async (req, res) => {
  if (req.body.phoneNumber) {
    const user = await Users.findOne({ phoneNumber: req.body.phoneNumber, });
    if (!user) {
      return res.status(404).json({ userNotFound: true, });
    } else {
      const now = moment();
      const code = Math.floor(1000 + Math.random() * 9000);
      await sendSms(req.body.phoneNumber.substring(1), "Votre code de confirmation Tech'Eat Fast est " + code.toString());
      await Users.updateOne({ sendDate: now.unix(), codeSended: code.toString() }, {phoneNumber: req.body.phoneNumber});

      return res.status(400).json({ resended: true, });
    }
  } else {
    return res.status(400).json({ invalidForm: true})
  }
}

exports.login = async (req, res) => {
  Users.customQuery("SELECT * FROM users WHERE phoneNumber=?", [
    req.body.phoneNumber,
  ])
    .then(async (user) => {
      if (user.length < 1) {
        res.status(404).json({ phoneNumber: false, password: false, });
      } else {
        const users = await Users.findOne({ idUser: user[0].idUser });
        const phoneNumbers = await Users.customQuery(
          "SELECT * FROM usersPhoneNumber WHERE idUser = ?",
          [user[0].idUser]
        );
        const address = await Users.customQuery(
          "SELECT * FROM usersAddress WHERE idUser = ?",
          [user[0].idUser]
        );
        const valid = await bcrypt.compare(req.body.password, users.password);
        if (valid) {
          if (users.activate) {
            res.status(200).json({
              user: {
                ...users,
                phoneNumbers: phoneNumbers,
                address: address,
                password: null,
              },
              token: jwt.sign({ idUser: user[0].idUser }, process.env.TOKEN),
            });
          } else {
            const now = moment();
            const code = Math.floor(1000 + Math.random() * 9000);
            await sendSms(req.body.phoneNumber.substring(1), "Votre code de confirmation Tech'Eat Fast est " + code.toString());
            await Users.updateOne({ sendDate: now.unix(), codeSended: code.toString() }, {phoneNumber: req.body.phoneNumber});
            return res.status(400).json({ accountNotActive: true, codeSended: true, });
          }
        } else {
          res.status(404).json({ phoneNumber: true, password: false, });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.loginNoJwt = async (req, res) => {
  Users.customQuery("SELECT * FROM users WHERE phoneNumber=?", [
    req.body.phoneNumber,
  ])
    .then(async (user) => {
      if (user.length < 1) {
        res.status(404).json({ phoneNumber: false, password: false, });
      } else {
        const users = await Users.findOne({ idUser: user[0].idUser });
        const phoneNumbers = await Users.customQuery(
          "SELECT * FROM usersPhoneNumber WHERE idUser = ?",
          [user[0].idUser]
        );
        const address = await Users.customQuery(
          "SELECT * FROM usersAddress WHERE idUser = ?",
          [user[0].idUser]
        );
        const valid = await bcrypt.compare(req.body.password, users.password);
        if (valid) {
          res.status(200).json({
            user: {
              ...users,
              phoneNumbers: phoneNumbers,
              address: address,
              password: null,
            },
          });
        } else {
          res.status(404).json({ phoneNumber: true, password: false, });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.addAddress = (req, res) => {
  const toInsert = {
    idUser: req.params.idUser,
    address: req.body.address,
    reference: req.body.reference ? req.body.reference : null,
  };

  Users.customQuery("INSERT INTO usersAddress SET ?", [toInsert])
    .then(() => {
      Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [
        req.params.idUser,
      ])
        .then((address) => {
          res.status(201).json({ create: true, address: address });
        })
        .catch((error) => {
          res.status(500).json({ error: true });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.addPhoneNumber = (req, res) => {
  const toInsert = {
    idUser: req.params.idUser,
    phoneNumber: req.body.phoneNumber,
  };

  Users.customQuery("INSERT INTO usersPhoneNumber SET ?", [toInsert])
    .then(() => {
      Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [
        req.params.idUser,
      ])
        .then((phoneNumbers) => {
          res.status(201).json({ create: true, phoneNumbers: phoneNumbers });
        })
        .catch((error) => {
          res.status(500).json({ error: true });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.addCommandSaved = (req, res) => {
  const now = moment();

  const dishes = req.body.dishes;
  const toInsert = {
    idRestaurant: req.body.idRestaurant,
    idUser: req.params.idUser,
    nameOfClient: req.user.name,
    nameOfCommand: req.body.name,
    emailOfClient: req.user.email,
    phoneNumberOfClient: req.body.phoneNumber,
    address: req.body.type === "toTake" ? null : req.body.address,
    comment: req.body.comment,
    type: req.body.type,
    creationDate: now.unix(),
    lastUpdate: now.unix(),
    paymentMethod: req.body.paymentMethod,
  };

  Users.customQuery("INSERT INTO commandsSaved SET ?", toInsert)
    .then(async (result) => {
      const insertId = result.insertId;

      try {
        const commandItems = await createDishTableForCommandsSaved(
          dishes,
          insertId
        );
        await Commands.customQuery(
          "INSERT INTO commandSavedItems (idCommandSaved, idDish, idOption, quantity) VALUES ?",
          [commandItems]
        )
          .then(async (result) => {
            return res.status(201).json({ create: true, insertId: insertId });
          })
          .catch((error) => {
            return res.status(500).json({ error: true });
          });
      } catch (error) {
        return res.status(500).json({ error: true });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: true });
    });
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Users.findOne({ email: email });
    if (user) {
      const secret = process.env.TOKEN_FORGOT_PASSWORD + user.password;
      const token = jwt.sign({ ...user }, secret, { expiresIn: "15m" });
      const url = `http://localhost:3001/reset-password/${user.idUser}/${token}`;
      console.log(url);
      return res.status(200).json({ emailSend: true });
    } else {
      return res.status(400).json({ invalidEmail: true });
    }
  } catch (error) {
    return res.status(500).json({ error: true });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log("====================================");
    console.log(req.body);
    console.log("====================================");
    const token = req.headers.authorization.split(" ")[1];
    const password = req.body.password;
    const user = req.user;
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_FORGOT_PASSWORD + user.password
    );

    if (decodedToken.idUser == user.idUser) {
      const schema = new passwordValidator(); // On crée une nouvelle instance de l'objet
      schema // On crée un nouveau schéma
        .is()
        .min(8) // Minimum length 8
        .has()
        .uppercase() // Must have uppercase letters
        .has()
        .lowercase() // Must have lowercase letters
        .has()
        .digits(2); // Must have at least 2 digits
      if (schema.validate(password)) {
        const hash = await bcrypt.hash(password, 10);
        await Users.updateOne(
          { password: hash },
          { idUser: req.params.idUser }
        );
        return res.status(200).json({ update: true });
      } else {
        return res.status(400).json({ invalidForm: true });
      }
    } else {
      return res.status(400).json({ invalidToken: true });
    }
  } catch (error) {
    return res.status(500).json({ error: true });
  }
};

exports.updateOneUser = (req, res) => {
  const toSet = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
  };
  Users.updateOne(toSet, { idUser: req.params.idUser })
    .then(() => {
      res.status(200).json({ update: true });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: true });
    });
};

exports.changePDP = (req, res) => {
  const toSet = {
    pdpUrl: `${req.protocol}://${req.get("host")}/PDP_Users/${req.file.filename
      }`,
  };

  Users.findOne({ idUser: req.params.idUser })
    .then((user) => {
      const filename = user.pdpUrl.split("/PDP_Users/")[1];
      filename !== "default.jpg"
        ? fs.unlinkSync(path.join(__dirname, "../PDP_Users", filename))
        : () => { };

      Users.updateOne(toSet, { idUser: req.params.idUser })
        .then(() => {
          res.status(200).json({ update: true });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: true });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: true });
    });
};

exports.updateAddress = (req, res) => {
  const toSet = {
    address: req.body.address,
    reference: req.body.reference ? req.body.reference : null,
  };

  if (req.address.idUser == req.user.idUser) {
    Users.customQuery("UPDATE usersAddress SET ? WHERE idUserAdress = ?", [
      toSet,
      req.params.idAddress,
    ])
      .then(() => {
        Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [
          req.params.idUser,
        ])
          .then((address) => {
            res.status(201).json({ update: true, address: address });
          })
          .catch((error) => {
            res.status(500).json({ error: true });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: true });
      });
  } else {
    res.status(400).json({ invalidToken: true });
  }
};

exports.updatePhoneNumber = (req, res) => {
  const toSet = {
    phoneNumber: req.body.phoneNumber,
  };

  if (req.phoneNumber.idUser == req.user.idUser) {
    Users.customQuery(
      "UPDATE usersPhoneNumber SET ? WHERE idUserPhoneNumber = ?",
      [toSet, req.params.idPhoneNumber]
    )
      .then(() => {
        Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [
          req.params.idUser,
        ])
          .then((phoneNumbers) => {
            res.status(201).json({ update: true, phoneNumbers: phoneNumbers });
          })
          .catch((error) => {
            res.status(500).json({ error: true });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: true });
      });
  } else {
    res.status(400).json({ invalidToken: true });
  }
};

exports.getOneUser = async (req, res) => {
  console.log("hey");
  try {
    const users = await Users.findOne({ idUser: req.params.idUser });
    const phoneNumbers = await Users.customQuery(
      "SELECT * FROM usersPhoneNumber WHERE idUser = ?",
      [req.params.idUser]
    );
    const address = await Users.customQuery(
      "SELECT * FROM usersAddress WHERE idUser = ?",
      [req.params.idUser]
    );
    const transactions = await Users.customQuery(
      "SELECT * FROM walletTransactions WHERE idUser = ?",
      [req.params.idUser]
    );

    res.status(200).json({
      find: true,
      result: {
        ...users,
        phoneNumbers: phoneNumbers,
        address: address,
        transactions: transactions,
        password: null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true });
  }
};

exports.getAllCommand = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      "SELECT * FROM commands WHERE idUser = ? ORDER BY idCommand DESC",
      [req.params.idUser]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getInProgressCommands = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      'SELECT * FROM commands WHERE idUser = ? AND status != "done" ORDER BY idCommand DESC',
      [req.params.idUser]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getInProgressCommandsNotConnected = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      'SELECT * FROM commands WHERE deviceId = ? AND status != "done" ORDER BY idCommand DESC',
      [req.params.idUser]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getCommandsWithTimestamp = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      "SELECT * FROM commands WHERE idUser = ? AND creationDate > ? AND creationDate <= ? ORDER BY idCommand DESC",
      [req.params.idUser, req.params.begin, req.params.end]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getAllAddress = (req, res) => {
  Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [
    req.params.idUser,
  ])
    .then((address) => {
      res.status(200).json({ find: true, result: address });
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.getAllPhoneNumber = (req, res) => {
  Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [
    req.params.idUser,
  ])
    .then((phoneNumber) => {
      res.status(200).json({ find: true, result: phoneNumber });
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.getAllCommandsSaved = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      "SELECT * FROM commandsSaved WHERE idUser = ?",
      [req.params.idUser]
    );
    res.status(200).json({ find: true, results: commands });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getInProgressCommandsInRestaurant = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      'SELECT * FROM commands WHERE deviceId = ? AND status != "done" AND type="inRestaurant" ORDER BY idCommand DESC',
      [req.params.idUser]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getCommandsWithTimestampInRestaurant = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      'SELECT * FROM commands WHERE deviceId = ? AND creationDate > ? AND creationDate <= ? AND type="inRestaurant" ORDER BY idCommand DESC',
      [req.params.idUser, req.params.begin, req.params.end]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.getAllCommandInRestaurant = async (req, res) => {
  try {
    const commands = await Commands.customQuery(
      'SELECT * FROM commands WHERE deviceId = ? AND type="inRestaurant" ORDER BY idCommand DESC',
      [req.params.idUser]
    );
    let response = [];

    for (let index in commands) {
      let el = commands[index];
      let commandItems = await Commands.customQuery(
        "SELECT * FROM commandItems WHERE idCommand = ?",
        [el.idCommand]
      );
      let restoInfo = await Restaurants.findOne({
        idRestaurant: el.idRestaurant,
      });
      response.push({ ...el, items: commandItems, restoInfo: restoInfo });
    }

    res.status(200).json({ find: true, result: response });
  } catch (error) {
    res.status(500).json({ error: true });
  }
};

exports.deleteOneUser = (req, res) => {
  Users.delete({ idUser: req.params.idUser })
    .then(() => {
      res.status(200).json({ delete: true });
    })
    .catch((error) => {
      res.status(500).json({ error: true });
    });
};

exports.deleteOneAddress = (req, res) => {
  if (req.address.idUser == req.user.idUser) {
    Users.customQuery("DELETE FROM usersAddress WHERE idUserAdress = ?", [
      req.params.idAddress,
    ])
      .then(() => {
        Users.customQuery("SELECT * FROM usersAddress WHERE idUser = ?", [
          req.params.idUser,
        ])
          .then((address) => {
            res.status(201).json({ delete: true, address: address });
          })
          .catch((error) => {
            res.status(500).json({ error: true });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: true });
      });
  } else {
    res.status(400).json({ invalidToken: true });
  }
};

exports.deleteOnePhoneNumber = (req, res) => {
  if (req.phoneNumber.idUser == req.user.idUser) {
    Users.customQuery(
      "DELETE FROM usersPhoneNumber WHERE idUserPhoneNumber = ?",
      [req.params.idPhoneNumber]
    )
      .then(() => {
        Users.customQuery("SELECT * FROM usersPhoneNumber WHERE idUser = ?", [
          req.params.idUser,
        ])
          .then((phoneNumbers) => {
            res.status(201).json({ delete: true, phoneNumbers: phoneNumbers });
          })
          .catch((error) => {
            res.status(500).json({ error: true });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: true });
      });
  } else {
    res.status(400).json({ invalidToken: true });
  }
};