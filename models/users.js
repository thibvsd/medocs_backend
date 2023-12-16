const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;


const drugSchema = mongoose.Schema({
  drug_id : {type: mongoose.Schema.Types.ObjectId,
    ref: 'drugs',},
  daily_presc: String,
});

const prescriptionSchema = mongoose.Schema({
presc_img: String,
})

const treatmentSchema = mongoose.Schema({
  med_reason: String,
  drugs: [drugSchema],
  prescription: [prescriptionSchema],
 });

 const favoritesSchema = mongoose.Schema({
  drug_id : {type: mongoose.Schema.Types.ObjectId,
    ref: 'drugs',}
});

 const searchSchema = mongoose.Schema({
  drug_id : {type: mongoose.Schema.Types.ObjectId,
    ref: 'drugs',}
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  age: Number,
  weight: Number,
  token: String,
  favorites: [favoritesSchema],
  search: [searchSchema],
  treatment: treatmentSchema,
});


const User = mongoose.model('users', userSchema);

module.exports = User;