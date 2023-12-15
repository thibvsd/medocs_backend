var express = require("express");
const User = require("../models/users");
var router = express.Router();

// Route qui enregistre la dernière recherche de médicament
router.post("/addLastSearch/:token", async (req, res) => {
  const user = await User.updateOne(
    { token: req.params.token },
    {
      $push: {
        search: {
          $each: [req.body._id],
          $position: 0, // Ajoute au début de la liste
          $slice: 5, // Garde au maximum 5 éléments
        },
      },
    }
  )
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => {
      res.json({ result: false });
    });
});



// Récupère les 5 dernières recherches d'un utilisateur
router.get("/last5Searches/:token", async (req, res) => {
  try {
    const userToken = req.params.token;

    // Recherche des favoris d'un utilisateur par token avec populate sur la clé étrangère 'favorites'
    const data = await User.findOne({ token: userToken }).populate('search');

    res.json({ result: true, search: data.search });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Récupère la dernière recherche d'un utilisateur
router.get("/lastSearch/:token", async (req, res) => {
  try {
    const userToken = req.params.token;

    // Recherche du premier élément du tableau 
    const data = await User.findOne({ token: userToken })
      .select({ search: { $slice: 1 } }) // $slice pour récupérer seulement le 1er élément
      .populate('search');

    if (data && data.search && data.search.length > 0) {
      res.json({ result: true, firstSearch: data.search[0] });
    } else {
      res.json({ result: false, message: "Aucune recherche trouvée." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});


module.exports = router;

