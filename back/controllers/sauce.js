const Sauce = require('../models/Sauce');  
const fs = require('fs'); //filesystem pour la gestion des fichiers (suppresion modification etc..)

//création d'une sauce via le parametre POST
exports.createSauce = (req, res, next) => {
  //analyse du body et création de la valeur 
  const sauceContent = JSON.parse(req.body.sauce);
  //suppression de l'ID
  delete sauceContent._id;
  //création de l'objet Sauce avec les parametres correspondants
  const sauce = new Sauce({
    ...sauceContent,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //enregistrement des données dans la BDD
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce correctement enregistrée !'}))
    .catch((error) => res.status(400).json({ error }));
};
  
//modification d'une sauce via le parametre UPDATE
  exports.modifySauce = (req, res, next) => {
    //recherche de la valeur ainsi que de ces parametres
    const sauceContent = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      //une fois trouvé modification de celle ci via UPDATE
    Sauce.updateOne({ _id: req.params.id }, { ...sauceContent, _id: req.params.id })
    //enregistrement des données dans la BDD
      .then(() => res.status(200).json({ message: 'Sauce correctement enregistrée !'}))
      .catch((error) => res.status(400).json({ error }));
  };
  
  //supression d'une sauce via le parametre DELETE
  exports.deleteSauce = (req, res, next) => {
    //recherche des parametres de l'objet 
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //url de l'image de la sauce et dans le tableau 
        const filename = sauce.imageUrl.split('/images/')[1];
        //supression du fichier par filesystem
        fs.unlink(`images/${filename}`, () => {
          //enregistrement des données dans la BDD
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch((error) => res.status(400).json({ error }));
        });
      })
    };
  
  //récupération de toutes les sauces
  exports.getAllSauces = (req, res, next) => {
    //recherche des objets
    Sauce.find()
    //affichage des données de la BDD
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//lecture de la sauce désirée
exports.getOneSauce = (req, res, next) => {
  //recuperation des parametres de l'objet
  Sauce.findOne({_id: req.params.id})
  //enregistrement des données dans la BDD
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({ error }));   
};

//création d'une fonction de notation (par like et dislike) via le parametre POST
exports.likeAndDislikeSauces = (req, res, next) => {

  let like = req.body.like
  let userId = req.body.userId
//recuperation des parametres de l'objet
  Sauce.findOne({ _id: req.params.id})
  .then( sauce => {
    //utilisation de switch/case pour figurer plusieurs cas et pour éviter une répétition de if et de else
  switch (like) {
    //si l'utilisateur like
    case 1 :
      //si l'utilisateur n'a pas liké
      if (!sauce.usersLiked.includes(userId)) {
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: +1 }, _id: req.params.id}) //push pour inserer la valeur de l'utilisateur dans la BDD , inc pour incrémenter +1 a la valeur du tableau
          .then(() => res.status(200).json({ message: "Je like" }))
          .catch((error) => res.status(400).json({ error }))
      }
      break;

    case 0 :
      //recuperation des parametres de l'objet
        Sauce.findOne({ _id: req.params.id})
           .then((sauce) => {
             //si l'ID de l'utilisateur se retrouve dans le tableau des likes
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }}) // pull permet d'enlever/retirer la valeur de l'utilisateur pour ensuite décrémenter le like dans le tableau
                .then(() => res.status(200).json({ message: "Non noté" }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }}) 
                .then(() => res.status(200).json({ message: "Non noté" }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 :
      //si l'utilisateur dislike
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: "Je like pas" }) })
          .catch((error) => res.status(400).json({ error }))
      break;

      default :
      throw { error: "Impossible d'ajouter ou de modifier vos likes" };
    }       
  })  
.catch(error => res.status(404).json({ error }));
}

