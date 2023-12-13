var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

//Route pour créer un nouvel utilisateur
router.post("/signup", (req, res) => {
  console.log(req.body)
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }


  
  // Check si l'utilisateur n'est pas deja enregistre dans la base de données
  User.findOne({ username: req.body.username }).then((data) => {

    //si utilisateur non enregistré
    if (data === null) {
      // Regex pour vérifier le format de l'e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Vérifiez le format de l'e-mail en utilisant le regex
      if (!emailRegex.test(req.body.email)) {
        res.json({ result: false, error: "Invalid email format" });
        return;
      }
      if(req.body.age > 120 || req.body.age < 0) {
        res.json({ result: false, error: "Invalid age" });
        return;
      }
      if(req.body.weight > 300 || req.body.weight < 0) {
        res.json({ result: false, error: "Invalid weight" });
        return;
      }

      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        age: req.body.age,
        weight: req.body.weight,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // Utilisateur deja enregistre dans la base de données
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// Route pour se connecter
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "email not found or wrong password" });
    }
  });
});

router.post("/addFavorites/:token", async(req, res) => {
  const user = await User.updateOne({ token: req.params.token }, { favorites: req.body.favo })
});


// Route pour enregistrer le nouveau mot de passe
// router.post("/changepassword", (req, res) => {
//   if (!checkBody(req.body, ["password"])) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }

//   User.findOne({ email: req.body.email }).then((data) => {
//     if (data) {
//       const hash = bcrypt.hashSync(req.body.password, 10);
//       User.save({ password: hash });
//       res.json({ result: true, token: data.token });
//   }})
// });



module.exports = router;
