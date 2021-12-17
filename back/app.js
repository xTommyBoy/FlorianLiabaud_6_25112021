const express = require('express'); // pour creer l'api
const bodyParser = require('body-parser'); // createur des middlewares pour afficher les corps de la requete 
const mongoose = require('mongoose'); //modelisation des données pour mongoDB
const path = require('path'); // pour travailler sur les chemins es fichiers
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const login = require('./login.json'); //connexion a la base de donnée
const helmet = require("helmet"); //sécurisation contre les attaques

const app = express();

//connexion a la base de donnée
mongoose.connect(login.db,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//paramétrage des headers
app.use((req, res, next) => {
  //indication du partage des ressources (dans ce cas pour tout le monde)
  res.setHeader('Access-Control-Allow-Origin', '*');
  //autorize les requêtes envoyées vers l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //authorisations des méthodes que nous allons utiliser
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(helmet());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
//permet d'indiquer a express d'utiliser et de rendre le dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;