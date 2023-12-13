var express = require('express');
var router = express.Router();
const Drug = require("../models/drugs");

// Récupère la data grâce à l'ID du medoc
router.get("/byId/:id", async (req, res) => {
  try {
    const donneesDrug = await Drug.findOne({ _id: req.params.id });
    res.json({ drug: donneesDrug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupère la data grâce au nom du medoc
router.get("/byName/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const donneesDrug = await Drug.find({ name: { $regex: new RegExp(name, 'i') } });
    res.json({ drug: donneesDrug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
