const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Commands = require('../Models/Commands')

module.exports = (req, res) => {
  const number = fs.readFileSync(path.join(__dirname, '../Assets/', 'number.txt'), 'utf-8');
  const { command, commandItems, restoInfo } = req;
  const now = moment.unix(command.creationDate);
  if (command.type === "toDelive") {
    const data = {
      data: {
        date: now.format('DD/MM/yyyy'),
        hours: now.format('HH:mm'),
        client: command.nameOfClient,
        restaurantName: restoInfo.name,
        restaurantAddress: restoInfo.address,
        orderId: command.orderId,
        number: number,
        paymentMethod: command.paymentMethod,
        logoUrl: restoInfo.logoUrl,
        address: command.address,
        phoneNumber: command.phoneNumberOfClient,
        item: commandItems,
        total: command.total,
      }
    }

    ejs.renderFile(path.join(__dirname, '../Assets', 'billToDelive.ejs'), data, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true });
      } else {
        let options = {
          width: "7.5cm",
        };

        const nameOfFile = `Facture_${number}_${command.nameOfClient}.pdf`;
        pdf.create(data, options).toFile(`Invoices/${nameOfFile}`, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: true });
          }
          Commands.updateOne({ invoiceUrl: `${req.protocol}://${req.get('host')}/Invoices/${nameOfFile}` }, { idCommand: req.params.idCommand })
            .then(() => {
              fs.writeFileSync(path.join(__dirname, '../Assets/', 'number.txt'), `${parseInt(number) + 1}`, 'utf8');
              res.status(200).json({ update: true });
            })
            .catch(() => {
              res.status(500).json({ error: true });
            });
        });
      }
    });
  } else {
    const data = {
      data: {
        number: number,
        date: now.format('DD/MM/yyyy'),
        hours: now.format('HH:mm'),
        client: command.nameOfClient,
        restaurantName: restoInfo.name,
        restaurantAddress: restoInfo.address,
        orderId: command.orderId,
        paymentMethod: command.paymentMethod,
        logoUrl: restoInfo.logoUrl,
        item: commandItems,
        total: command.total,
      }
    }

    ejs.renderFile(path.join(__dirname, '../Assets', 'billToTake.ejs'), data, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: true });
      } else {
        let options = {
          width: "7.5cm",
        };

        const nameOfFile = `Facture_${number}_${command.nameOfClient}.pdf`;
        pdf.create(data, options).toFile(`Invoices/${nameOfFile}`, (err, data) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: true });
          }
          Commands.updateOne({ invoiceUrl: `${req.protocol}://${req.get('host')}/Invoices/${nameOfFile}` }, { idCommand: req.params.idCommand })
            .then(() => {
              fs.writeFileSync(path.join(__dirname, '../Assets/', 'number.txt'), `${parseInt(number) + 1}`, 'utf8');
              res.status(200).json({ update: true });
            })
            .catch(() => {
              res.status(500).json({ error: true });
            });
        });
      }
    });
  }
}