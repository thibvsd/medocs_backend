var express = require('express');
var router = express.Router();

/* GET articles page. */
router.get('/', function(req, res, next) {
  res.render('articles', { title: 'Express' });
});

module.exports = router;
