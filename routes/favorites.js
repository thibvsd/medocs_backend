var express = require("express");
const User = require("../../../medidoc_old copy/backend/medocs_backend/models/users");
var router = express.Router();

// Supprime un favori par id
router.delete("/:token/:drug_id", async (req, res) => {
  try {
    const userToken = req.params.token;
    const drugId = req.params.drug_id;
    // Recherche de l'utilisateur par token
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }
    // Suppression de l'ID du médicament dans le tableau des favoris
    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== drugId
    );
    // Enregistrement de l'utilisateur mis à jour
    await user.save();
    res.json({ result: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Ajoute un favori
router.post("/:token/addFavorite/:drug_id", async (req, res) => {
  try {
    const userToken = req.params.token;
    const drugId = req.params.drug_id;
    // Recherche de l'utilisateur par token
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }
    // Vérification si le médicament existe déjà dans les favoris
    const isDrugAlreadyFavorited = user.favorites.some(
      (favoriteId) => favoriteId.toString() === drugId
    );
    if (isDrugAlreadyFavorited) {
      return res.json({ result: false, error: "Drug already in favorites" });
    }
    // Ajout de l'ID du médicament dans le tableau des favoris
    user.favorites.push(drugId);
    // Enregistrement de l'utilisateur mis à jour
    await user.save();
    res.json({ result: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});


// Vérifie si un favori est présent
router.get("/:token/isFavorite/:drug_id", async (req, res) => {
  try {
    const userToken = req.params.token;
    const drugId = req.params.drug_id;

    // Recherche de l'utilisateur par token
    const user = await User.findOne({ token: userToken });

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Vérification si le médicament existe déjà dans les favoris
    const isDrugFavorite = user.favorites.some(favoriteId => favoriteId.toString() === drugId);

    res.json({ result: true, isFavorite: isDrugFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

module.exports = router;
