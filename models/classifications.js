const mongoose = require('mongoose');

const classificationSchema = mongoose.Schema({
  code: String,
  label: String,
});


const Classification = mongoose.model('classifications', classificationSchema);

module.exports = Classification;