const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const commandSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  idDeliverer: { type: String, required: false },
  idUser: { type: String, required: true },
  phoneNumber: { type: [Number], required: false },
  email: { type: [String], required: false },
  comment: { type: String },
  adress: { type: String },
  creationDate: { type: Date, required: true },
  lastUpdate: { type: Date, required: true },
  type: { type: String, required: true }, // toTake, toDelive

  /*
    Structure: 
    [
      { idDish: l'id du plâts, price: le prix, quantity: la quantité, total: le total }
    ]
  */
  item: { type: [Object], required: true },

  total: { type: Number, required: true }, // Le total général

  paymentMethod: { type: String, required: true }, // Possiblilité: CB, m-pesa, airtel-money, orange-money, direct-cash

  accept: { type: String, required: true }, // Possiblilité: inLoading, true, false

  whyRefused: { type: String, required: false }, 

  canRetry: { type: Boolean, required: false }, 

  status: { type: String, required: true } // Possiblilité: inLoading, inCooking, outRestaurant, ready
});

commandSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Commands', commandSchema, 'Commands'); 