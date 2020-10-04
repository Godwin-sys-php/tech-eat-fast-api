const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');// Le plugin pour avoir des champs unique

// Schema pour les utilisateurs

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  pseudo: { type: String, required: true, unique: true },
  creationDate: { type: Date, required: true },
  password: { type: String, required: true, unique: true },
  address: { type: [String] },
  phoneNumber: { type: [String] }
});

userSchema.plugin(uniqueValidator);// On ajoute le mongoose-unique-validator au Schema

module.exports = mongoose.model('Users', userSchema, 'Users'); 