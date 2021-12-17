const jwt = require('jsonwebtoken'); //générateur de tokens et gestions de ceux ci

module.exports = (req, res, next) =>
{
    try
    {
        //check pour voir si l'utilisateur qui tente d'acceder au site est bien authentifié 
        const token = req.headers.authorization.replace('Bearer ', '');
        //décode du token et vérification via jwt
        const decodetoken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodetoken.userId;
        //si l'ID du token de l'utilisateur est différent il refuse la connexion 
        if(req.body.userId && req.body.userId !== userId)
        {
            throw " L'ID de l'utilisateur est non valable !";
        }
        else
        {
            next();
        }
    }

        catch (error)
        {
            res.status(401).json({ error: error | 'Requête non identifiée'});
        }
};
