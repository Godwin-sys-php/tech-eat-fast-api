const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const menuSchema = mongoose.Schema({
  idRestaurant: { type: String, required: true },
  name: { type: String, required: true },
  creationDate: { type: Date, required: true },
});

menuSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Menus', menuSchema, 'Menus'); 