const jwt = require('jsonwebtoken');
const Cookies = require( "cookies" );

module.exports = (req, res, next) => {

    // 01/ Récupération du token dans le cookie
    let accessToken = new Cookies(req,res).get('access_token');

    // 02/ Si le cookie (access_token) n'existe pas
    if(accessToken == null)
    {
        return res.sendStatus(401);
    }

    // 03/ Sinon on vérifie le JWT
    return jwt.verify(accessToken, process.env.JWT_SECRET_KEY, function(error, dataJwt)
    {

        // error = pas un jwt ou modifié ou expiré
        if(error)
        {

            return res.sendStatus(403)
        }

        if(typeof dataJwt != 'undefined')
        {
            // recreate session if is loggedin
            req.session.user = dataJwt;
            next();
        }
        // user is not admin
        else
        {
            return res.sendStatus(403)
        }
    });
}