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
router.post("/addPrescription/:token", async (req, res) => {
  try {
    // Vérifie si l'utilisateur est connecté
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non connecté" });
    }
    const prescriptionTreatment = { presc_img: req.body.presc_img };
    user.treatment.prescription.push(prescriptionTreatment);

    await user.save();

    res.json({ result: true, prescriptionTreatment: user.treatment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Route qui supprime une ordonnance
router.delete("/deletePrescription/:token/", async (req, res) => {
  try {
    const prescImg = req.presc_img;
    // Recherche de l'utilisateur par token
    const user = await User.findOne({ token: req.params.token });
    if (!user) {
      return res.json({ result: false, error: "Utilisateur non connecté" });
    }
    // Suppression de l'ordonnance
    user.treatment.prescription = user.treatment.prescription.filter(
      (prescriptionTreatment) => prescriptionTreatment.presc_img.toString() !== prescImg
    );
    
    await user.save();
    res.json({ result: true, prescriptionTreatment: user.treatment.prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Route pour sauvegarder la dose d'un médicament
router.post('/saveDose/:token', async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token }).populate('treatment.drugs.drug_id');

    if (!user) {
      return res.json({ result: false, error: 'Utilisateur non connecté' });
    }

    const foundDrug = user.treatment.drugs.find(
      (drug) => drug.drug_id._id.toString() === req.body.drugId.toString()
    );

    if (foundDrug) {
      foundDrug.daily_presc = req.body.dose.toString();
      // Sauvegarde les modifications
      await user.save();
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'Médicament non trouvé' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});


router.post("/updateDrugTreatment/:token", async (req, res) => {
  try {
    const user = await User.findOne({ token: req.params.token });

    if (!user) {
      return res.json({ result: false, error: "Utilisateur non connecté" });
    }

    // Met à jour le dosage du médicament
    user.treatment.med_reason = req.body.med_reason;

    // Sauvegarde les modifications
    await user.save();

    res.json({ result: true, medReason: user.treatment.med_reason, validation:"Données enregistrées avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Récupère les traitements d'un utilisateur
router.get("/:token", async (req, res) => {
  try {
    const userToken = req.params.token;

    // Recherche des favoris d'un utilisateur par token avec populate sur la clé étrangère 'favorites'
    const data = await User.findOne({ token: userToken })
      .populate({
        path: 'treatment.drugs.drug_id', //path: chemin du champ qui contient la réference à la clé étrangère
        select: '_id name', //select: liste de champs séparés par des espaces à sélectionner 
      });
    res.json({ result: true, treatment: data.treatment });
    console.log("treatment load back", data.treatment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

module.exports = router;
