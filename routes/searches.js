var express = require("express");
const User = require("../models/users");
var router = express.Router();


// Route qui enregistre la dernière recherche de médicament
router.post("/addLastSearch/:token", async (req, res) => {
  const user = await User.findOne({ token: req.params.token });

  // Vérifie si l'ID du médicament est déjà présent dans la liste search
  const isIdAlreadyInSearch = user.search.some((item) => item.drug_id === req.body._id);

  if (isIdAlreadyInSearch) {
    // Si l'ID est déjà enregistré, renvoie une réponse sans effectuer de modifications
    return res.json({ result: true, message: "ID déjà présent dans la liste search" });
  }

  // Ajoute l'ID au début de la liste en limitant à 5 éléments
  user.search.unshift({ drug_id: req.body._id });
  user.search = user.search.slice(0, 5);

  // Sauvegarde les modifications dans la base de données
  user.save()
    .then(() => {
      res.json({ result: true });
    })
    .catch((err) => {
      res.json({ result: false, error: err.message });
    });
});




// Route qui récupère les 5 dernières recherches d'un utilisateur
router.get("/last5Searches/:token", async (req, res) => {
  try {
    const userToken = req.params.token;
    // Recherche des favoris d'un utilisateur par token avec populate sur la clé étrangère 'favorites'
    const data = await User.findOne({ token: userToken }).populate('search.drug_id');
console.log(data)
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

