const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>
{
    try
    {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decodetoken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodetoken.userId;
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
