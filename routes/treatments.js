var express = require("express");
const User = require("../models/users");
var router = express.Router();

// Route qui enregistre un traitement => !!!! A MODIFIER (utilisation schema)/TESTER
router.post("/addtreatment/:token", async (req, res) => {
  const user = await User.updateOne();
});


// Route qui enregistre une ordonnance



// Récupère les traitements d'un utilisateur => !!!! A MODIFIER/TESTER

router.get("/treatment/:token", async (req, res) => {
  try {
    const userToken = req.params.token;

    // Recherche des favoris d'un utilisateur par token avec populate sur la clé étrangère 'favorites'
    const data = await User.findOne({ token: userToken }).populate('treatment');

    res.json({ result: true, treatment: data.treatment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});



module.exports = router;

