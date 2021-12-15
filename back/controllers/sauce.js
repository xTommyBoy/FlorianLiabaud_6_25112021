const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceContent = JSON.parse(req.body.sauce);
  delete sauceContent._id;
  const sauce = new Sauce({
    ...sauceContent,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce correctement enregistrée !'}))
    .catch((error) => res.status(400).json({ error }));
};
  
  exports.modifySauce = (req, res, next) => {
    const sauceContent = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceContent, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce correctement enregistrée !'}))
      .catch((error) => res.status(400).json({ error }));
  };
  
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ message: "Sauce supprimée" }));
  };
  
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({ error }));   
};

exports.likeAndDislikeSauces = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId

  Sauce.findOne({ _id: req.params.id})
  .then( sauce => {
  switch (like) {
    case 1 :
      if (!sauce.usersLiked.includes(userId)) {
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: +1 }, _id: req.params.id})
          .then(() => res.status(200).json({ message: "Je like" }))
          .catch((error) => res.status(400).json({ error }))
      }
      break;

    case 0 :
        Sauce.findOne({ _id: req.params.id})
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
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

