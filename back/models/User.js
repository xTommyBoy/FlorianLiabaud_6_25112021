const mongoose = require('mongoose'); //modelisation des données pour mongoDB
const uniqueValidator = require('mongoose-unique-validator'); //prévalidateur pour mongoDB afin d'éviter d'avoir plusieurs adresses email sur un meme compte (par exemple) 


//modèle de l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);