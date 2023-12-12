var express = require('express');
var router = express.Router();

/* GET favorites page. */
router.get('/', function(req, res, next) {
  res.render('favorites', { title: 'Express' });
});


module.exports = router;
