var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Drug = require("../models/drugs");
const Article = require("../models/articles");
const Classification = require("../models/classifications");

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

// Récupère la data actu d'une source spécifiée
router.get("/byId/:source", (req, res) => {
  const source = req.params.source;
 const sourceArticles = Article.filter(item => item.source.includes(source));
 res.json({ sourceArticles: sourceArticles });
});

// Récupère tous les articles dont le contenu contient le mot-clé
router.get("/bySourceAndKeyword/:source/:keyword", async (req, res) => {
  try {
    const source = req.params.source;
    const keyword = req.params.keyword.toLowerCase();

    let query = {};

    if (source !== "undefined" && keyword !== "undefined") {
      // Les deux filtres sont appliqués
      query = {
        source: { $regex: source, $options: "i" },
        $or: [
          { content: { $regex: keyword, $options: "i" } },
          { title: { $regex: keyword, $options: "i" } },
        ],
      };
    } else if (source !== "undefined") {
      // Seulement le filtre source est appliqué
      query = { source: { $regex: source, $options: "i" } };
    } else if (keyword !== "undefined") {
      // Seulement le filtre mot-clé est appliqué
      query = {
        $or: [
          { content: { $regex: keyword, $options: "i" } },
          { title: { $regex: keyword, $options: "i" } },
        ],
      };
    } else {
      // Aucun filtre n'est appliqué, récupérer tous les articles
      query = {};
    }

    //const combinedArticles = await Article.find(query).limit(10);

    const combinedArticles = await Article.aggregate([
      // Étape 1: Filtrer les documents
      { $match: query },
      
      // Étape 2: Regrouper les documents par titre, en prenant le premier document de chaque groupe
      { $group: { 
          _id: "$title",  // _id dans $group est utilisé pour la distinction
          doc: { $first: "$$ROOT" } // $$ROOT représente le document original
      }},
      
      // Étape 3: Préparer les documents dans leur format original
      { $replaceRoot: { newRoot: "$doc" } },
      
      // Étape 4: Appliquer la limite
      { $limit: 10 }
    ]);


    res.json({ combinedArticles: combinedArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route pour récupérer les 3 dernières actualités par date
router.get("/latestNews", async (req, res) => {
  try {
    // Utilisation de la méthode sort pour trier les articles par date de manière décroissante
    // Ensuite, limit(3) récupère seulement les trois premiers
    const latestNews = await Article.aggregate([
      {
        $group: {
          _id: "$url", // Regroupement par URL
          latestArticle: { $first: "$$ROOT" }, // Sélection du 1er article de chaque groupe
        },
      },
      { $replaceRoot: { newRoot: "$latestArticle" } }, // Remplacer la racine du document par l'article sélectionné
      { $sort: { date: -1 } }, // Tri par date décroissante
      { $limit: 3 },
    ]).exec();
    res.json({ latestNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Définit la route pour récupérer toutes les sources
router.get("/sources", async (req, res) => {
  try {
    // Utilise la méthode distinct de Mongoose pour récupérer toutes les sources sans doublons
    const sources = await Article.distinct("source");

    // Renvoie la liste des sources en réponse
    res.json({ result: true, sources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Définis la route pour récupérer toutes les familles de medocs
router.get("/codes", async (req, res) => {
  try {
    // Utilise la méthode distinct de Mongoose pour récupérer toutes les sources sans doublons
    const codes = await Classification.find(
      {
        $and: [
          { $expr: { $eq: [{ $strLenCP: "$code" }, 1] } },
          { code: { $nin: ["v", "z"] } },
        ],
      },
      {
        _id: 0, // Exclut le champ _id du résultat
        label: 1, // Inclut uniquement le champ label dans le résultat
      }
    ).sort({ label: 1 });
    // Renvoie la liste des sources en réponse
    res.json({ result: true, codes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

module.exports = router;
