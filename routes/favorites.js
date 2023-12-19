var express = require("express");
const User = require("../models/users");
var router = express.Router();



// Supprime un favori par id
router.delete("/deleteFavorite/:token/:_id", async (req, res) => {
  try {
    const userToken = req.params.token;
    const drugId = req.params._id;
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
    res.json({ result: true, favorites: userfavorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Ajoute un favori
// router.post("/addFavorite/:token", async (req, res) => {
//   try {
//     const userToken = req.params.token;
//     const drugId = req.body._id;
//     // Recherche de l'utilisateur par token
//     const user = await User.findOne({ token: userToken });
//     if (!user) {
//       return res.json({ result: false, error: "User not found" });
//     }
//     // Vérification si le médicament existe déjà dans les favoris
//     const isDrugAlreadyFavorited = user.favorites.some(
//       (favoriteId) => favoriteId.toString() === drugId
//     );
//     if (isDrugAlreadyFavorited) {
//       return res.json({ result: false, error: "Drug already in favorites" });
//     }
//     // Ajout de l'ID du médicament dans le tableau des favoris
//     user.favorites.push(drugId);
//     // Enregistrement de l'utilisateur mis à jour
//     await user.save();
//     res.json({ result: true, user: user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ result: false, error: "Internal Server Error" });
//   }
// });

router.post("/addFavorites/:token", async (req, res) => {
  const user = await User.findOne({ token: req.params.token });

  // Vérifie si l'ID du médicament est déjà présent dans les favoris
  const isIdAlreadyInFavo = user.favorites.some((item) => item.drug_id === req.body.favo);

  if (isIdAlreadyInFavo) {
    // Si l'ID est déjà enregistré, renvoie une réponse sans effectuer de modifications
    return res.json({ result: true, message: "ID déjà présent dans les favoris" });
  }

  // Ajoute l'ID au début de la liste en limitant à 5 éléments
  user.favorites.unshift({ drug_id: req.body.favo });

  // Sauvegarde les modifications dans la base de données
  user.save()
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => {
      res.json({ result: false, error: err.message });
    });
});



// Vérifie si un favori est présent
router.get("/isFavorite/:token/:_id", async (req, res) => {
  try {
    const userToken = req.params.token;
    const drugId = req.params._id;

    // Recherche de l'utilisateur par token avec populate sur la clé étrangère 'favorites'
    const user = await User.findOne({ token: userToken }).populate('favorites');

    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Vérification si le médicament existe déjà dans les favoris
    const isDrugFavorite = user.favorites.some(favorite => favorite._id.toString() === drugId);

    res.json({ result: true, isFavorite: isDrugFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});



// Récupère tout les favoris d'un utilisateur
router.get("/loadFavorite/:token", async (req, res) => {
  try {
    const userToken = req.params.token;

    // Recherche des favoris d'un utilisateur par token avec populate sur la clé étrangère 'favorites'
    const data = await User.findOne({ token: userToken }).populate({
      path: 'favorites.drug_id',
      select: '_id name', // Sélectionne uniquement les champs _id et name
    });

    // Transformation des résultats pour obtenir un format spécifique
    const idAndName = data.favorites.map((favorite) => {
      return {
        _id: favorite.drug_id._id,
        name: favorite.drug_id.name,
      };
    });

    res.json({ result: true, idAndName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});


module.exports = router;

