var express = require("express");
var router = express.Router();
const Drug = require("../models/drugs");

// Récupère les noms des medocs
router.get("/allNames", (req, res) => {
  Drug.find()
    .limit(10)
    .then((data) => {
      const namesAndId = data.map((drug) => ({
        name: drug.name,
        _id: drug._id,
      }));
      res.json({ namesAndId });
    });
});

// Récupère les noms des medocs avec 3 caractères saisis
router.get("/query3characters/:query", async (req, res) => {
  console.log(req.params);
  const regex = new RegExp(`${req.params.query}`, "i"); // Regex pour rechercher les noms commençant par la requête
  const data = await Drug.find({ name: regex }, "name _id").limit(10);
  const namesAndId = data.map((drug) => ({ name: drug.name, _id: drug._id }));
  console.log('[Names & ID]', namesAndId);
  res.json({ namesAndId });
});

// Récupère la data grâce à l'ID du medoc
router.get("/byId/:id", async (req, res) => {
  try {
    const donneesDrug = await Drug.findOne({ _id: req.params.id }).populate(
      "classification"
    )
    res.json({ drug: donneesDrug });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupère la data grâce au nom du medoc
router.get("/byName/:name", async (req, res) => {
  try {
    const name = req.params.name;
    if (name.length < 3) {
      return res.status(400).json({ message: "Saisie insuffisante" });
    }
    const donneesDrug = await Drug.find({
      name: { $regex: new RegExp(name, "i") },
    });
    // console.log(donneesDrug);

    // Map pour alléger la réponse et n'extraire que les name et ID :
    const drugsFound = donneesDrug.map(({ _id, name }) => ({ _id, name }));
    res.json(drugsFound);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
