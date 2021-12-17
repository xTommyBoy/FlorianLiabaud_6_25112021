const multer = require('multer'); // permet de gérer les fichiers entrants dans les requêtes HTTP et de télécharger des fichiers 

//type de fichiers authorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//destination de l'upload des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //récupération du nom de l'image
  filename: (req, file, callback) => {
    //remplace les espaces des noms de l'image par des underscores
    const name = file.originalname.split(" ").join("_");
    //si l'extension n'est pas bonne remplacer par les extensions authorisés
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage}).single('image');