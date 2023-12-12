const mongoose = require('mongoose');

const drugSchema = mongoose.Schema({
  cis: Number,
  admin_mode: String,
  name: String,
  classification: {type: mongoose.Schema.Types.ObjectId,
    ref: 'classifications'},
  smr: String,
  survey_indic: Boolean,
  therap_indic: String,
  dosage: String,
  use_precaution: String,
  indesirable_eff: String,
  breastfeed_alert: Boolean,
  pregnancy_alert: Boolean,
  driving_alert: Boolean,
  on_prescription: Boolean,
});


const Drug = mongoose.model('drugs', drugSchema);

module.exports = Drug;