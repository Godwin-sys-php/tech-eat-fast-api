const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');// Le plugin pour avoir des champs unique


const userSchema = mongoose.Schema({
  idRestaurant: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: false },
  creationDate: { type: Date, required: true },
  password: { type: String, required: true, unique: true },
  pdpUrl: { type: String },
  level: { type: Number, required: true, default: 1 } // 1: Normal, 2: Modification Menus and Dishes, 3: Users and resto info, 4: Supervisor
});

userSchema.plugin(uniqueValidator);// On ajoute le mongoose-unique-validator au Schema

module.exports = mongoose.model('UsersRestaurant', userSchema, 'UsersRestaurant'); 