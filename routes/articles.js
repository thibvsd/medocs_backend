var express = require('express');
var router = express.Router();
const User = require("../models/users");
const Drug = require("../models/drugs");
const Article = require("../models/articles");


// Récupère la data actu d'un médoc grâce à l'ID du medoc
router.get("/byId/:drug_id", (req, res) => {
   const drug_id = req.params.drug_id;
  const drugArticles = Article.filter(item => item.drug_id.includes(drug_id));
  res.json({ drugArticles: drugArticles });
});


// Récupère la data actu d'une famille de médocs (="label" de la collection classification)
router.get('/byLabel/:label', async (req, res) => {
  try {
    const label = req.params.label;

    // Utilisation de populate pour récupérer les données et les stocker dans articlesByLabel
    const articlesByLabel = await Article.find({}).populate({
      path: 'drug_id',
      model: 'Drug',
      populate: {
        path: 'classification',
        model: 'Classification',
      },
    }).exec();

    // Filtrer les articles par la famille spécifiée (label)
    const filteredArticles = articlesByLabel.filter(article => {
      return article.drug_id.classification.label === label;
    });

    res.json({ articlesByLabel: filteredArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// Récupère la data actu d'une source spécifiée
router.get("/byId/:source", (req, res) => {
  const source = req.params.source;
 const sourceArticles = Article.filter(item => item.source.includes(source));
 res.json({ sourceArticles: sourceArticles });
});

// Récupère tous les articles dont le contenu contient le mot-clé
router.get("/byKeyword/:keyword", (req, res) => {
  // Convertit le mot-clé en minuscules pour une recherche insensible à la casse
  const keyword = req.params.keyword.toLowerCase(); 
  // Filtre les articles dont le contenu contient le mot-clé
  const keywordArticles = Article.filter(item => item.content.toLowerCase().includes(keyword));
  res.json({ keywordArticles: keywordArticles });
});


// Route pour récupérer les 3 dernières actualités par date
router.get('/latestNews', async (req, res) => {
  try {
    // Utilisation de la méthode sort pour trier les articles par date de manière décroissante
    // Ensuite, limit(3) récupère seulement les trois premiers
    const latestNews = await Article.find({}).sort({ date: -1 }).limit(3).exec();

    res.json({ latestNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


module.exports = router;
