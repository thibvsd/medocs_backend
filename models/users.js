const mongoose = require('mongoose');

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

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  age: Number,
  weight: Number,
  token: String,
  favorites: [{type: mongoose.Schema.Types.ObjectId,
    ref: 'drugs',}],
  search: [{type: mongoose.Schema.Types.ObjectId,
    ref: 'drugs',}],
  treatment: [treatmentSchema],
});


const User = mongoose.model('users', userSchema);

module.exports = User;