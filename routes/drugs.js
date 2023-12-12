var express = require('express');
var router = express.Router();

// Récupère la data grâce à l'ID du medoc
router.get("/byId/:id", (req, res) => {
  const donneesDrug = data.find((e) => e._id === Number(req.params.id));
  res.json({ drug: donneesDrug });
});

//Récupère la data grâce au nom du medoc
router.get("/byName/:name", (req, res) => {
   const name = req.params.name;
  const donneesDrug = data.filter(item => item.name.includes(name));
  res.json({ drug: donneesDrug });
});

module.exports = router;
