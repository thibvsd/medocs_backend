var express = require('express');
var router = express.Router();


// Récupère la data actu d'un médoc grâce à l'ID du medoc
router.get("/byId/:drug_id", (req, res) => {
   const drug_id = req.params.drug_id;
  const drugArticles = data.filter(item => item.drug_id.includes(drug_id));
  res.json({ drugArticles: drugArticles });
});


module.exports = router;
