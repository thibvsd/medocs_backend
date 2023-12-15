var express = require("express");
const User = require("../models/users");
var router = express.Router();

// Route qui enregistre un médicament dans traitement 
router.post("/addDrugTreatment/:token", async (req, res) => {
  try {
    // Vérifie si l'utilisateur est connecté
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non connecté" });
    }
    const drugTreatment = { drug_id: req.body._id, daily_presc:"" };
    console.log(user.treatement);
    user.treatment.drugs.push(drugTreatment);

    await user.save();

    res.json({ result: true, drugTreatment: user.treatment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Route qui supprime un traitement
router.delete("/deleteDrugTreatment/:token/", async (req, res) => {
  try {
    const drugId = req.body._id;
    // Recherche de l'utilisateur par token
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non connecté" });
    }
    // Suppression de l'ID du médicament dans les traitements
    user.treatment.drugs = user.treatment.drugs.filter(
      (drugTreatment) => drugTreatment.drug_id.toString() !== drugId
    );
    // Enregistrement de l'utilisateur mis à jour
    await user.save();
    res.json({ result: true, drugTreatment: user.treatment.drugs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});


// Route qui enregistre une ordonnance

// Route qui supprime une ordonnance


// Route qui met à jour la raison médicale (quand clique sur Save en bas sur TreatmentsScreen)
// !!! A METTRE A JOUR POUR QUE CA SAUVEGARDE EGALEMENT LE DOSAGE 
router.post("/addMedReason/:token", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });

    if (!user) {
      return res.json({ result: false, error: "Utilisateur non connecté" });
    }

    // Met à jour la raison médicale avec la nouvelle valeur
    user.treatment.med_reason = req.body.med_reason;

    // Sauvegarde les modifications
    await user.save();

    res.json({ result: true, medReason: user.treatment.med_reason });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Récupère les traitements d'un utilisateur => !!!! A TESTER

router.get("/:token", async (req, res) => {
  try {
    const userToken = req.params.token;

    // Recherche des favoris d'un utilisateur par token avec populate sur la clé étrangère 'favorites'
    const data = await User.findOne({ token: userToken }).populate('treatment.drugs.drug_id');

    res.json({ result: true, treatment: data.treatment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

module.exports = router;
