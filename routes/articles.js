var express = require('express');
var router = express.Router();
const User = require("../models/users");
const Drug = require("../models/drugs");
const Article = require("../models/articles");


// Récupère la data actu d'un médoc grâce à l'ID du medoc
router.get("/byId/:drug_id", async (req, res) => {
  const drug_id = req.params.drug_id;
  try {
    // Utilisation de find pour récupérer tous les documents qui correspondent à l'ID du médicament
    const articlesById = await Article.find({ drug_id: drug_id });

    res.json({ drugArticles: articlesById });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
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
    const latestNews = await Article.aggregate([
      {
        $group: {
          _id: '$url', // Regroupement par URL
          latestArticle: { $first: '$$ROOT' } // Sélection du 1er article de chaque groupe
        }
      },
      { $replaceRoot: { newRoot: '$latestArticle' } }, // Remplacer la racine du document par l'article sélectionné
      { $sort: { date: -1 } }, // Tri par date décroissante
      { $limit: 3 }
    ]).exec();
    res.json({ latestNews });
    console.log("back", latestNews)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


// route pour envoyer des nouveaux articles pour pouvoir tester (inutile à terme)
router.post('/newArticle', async (req, res) => {
  try {
    const newArticle = new Article({
    title: req.body.title,
  date: req.body.date,
  source: req.body.source,
  content: req.body.content,
  illustration: req.body.img,
  url: req.body.url,
  drug_id: req.body._id});
    await newArticle.save();
    res.json({ message: 'Article ajoute avec succes' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  } 
})


// Définis la route pour récupérer toutes les sources
router.get('/sources', async (req, res) => {
  try {
    // Utilise la méthode distinct de Mongoose pour récupérer toutes les sources sans doublons
    const sources = await Article.distinct('source');
    
    // Renvoie la liste des sources en réponse
    res.json({ result: true, sources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});

// Définis la route pour récupérer toutes les sources
router.get('/labels', async (req, res) => {
  try {
    // Utilise la méthode distinct de Mongoose pour récupérer toutes les sources sans doublons
    const labels = await Classification.distinct('label');
    
    // Renvoie la liste des sources en réponse
    res.json({ result: true, labels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
