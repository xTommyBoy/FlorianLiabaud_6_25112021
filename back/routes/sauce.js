const express = require('express');
//permet la gestion du routage
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-conf');

const sauceCtrl = require('../controllers/sauce');

//définition des routes
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, sauceCtrl.likeAndDislikeSauces);


module.exports = router;