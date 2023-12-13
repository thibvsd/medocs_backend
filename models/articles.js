const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: String,
  date: String,
  source: String,
  content: String,
  illustration: String,
  url: String,
  drug_id: [{type: mongoose.Schema.Types.ObjectId,
    ref: 'drugs',}],
});


const Article = mongoose.model('articles', articleSchema);

module.exports = Article;