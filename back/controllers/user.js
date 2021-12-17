const usersign = require('../models/User');
const bcrypt = require('bcrypt'); //permet de hasher des mot de passes
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 11)
    //hashage du mot de passe 11 fois
    .then(hash => {
      //création de l'inscription via email et mdp
      const user = new usersign({
        email: req.body.email,
        password: hash
      });
      //enregistrement de l'utilisateur dans la BDD
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur correctement créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res,next) => {
    usersign.findOne({ email: req.body.email })
    //recherche de l'utilisateur dans la BDD
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      //comparaison entre la requete du mdp hashé et celle dans la BDD
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            //création du token
            token: jwt.sign(
              { userId: user._id},
              'RANDOM_TOKEN_SECRET',
              //expire tout les 7h pour éviter une attaque d'hijacking
              {expiresIn: '7h'}
            )
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};