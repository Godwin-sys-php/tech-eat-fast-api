const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');// Le plugin pour avoir des champs unique


const delivererSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  name: { type: String, required: true },
  pdpUrl: { type: String },
  creationDate: { type: Date, required: true },
  phoneNumber: { type: [Number] },
  plaque: { type: String, required: true },
  available: { type: Boolean, required: true, default: true }
});

delivererSchema.plugin(uniqueValidator);// On ajoute le mongoose-unique-validator au Schema

module.exports = mongoose.model('Deliverer', delivererSchema, 'Deliverer'); 