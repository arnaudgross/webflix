const UserModel = require('../../models/User.js');
const MovieModel = require('../../models/Movie.js');

const jwt = require('jsonwebtoken');
const Cookies = require( "cookies" );

module.exports = class AdminIndex
{
    index(request, response)
    {
        let Movie = new MovieModel();

        Movie.getAll()
            .then(function(result)
            {
                if(result != false)
                {
                    response.render('admin/index', { movies: result });
                }
                else
                {
                    response.render('admin/index', { error: 'No movie found :/' });
                }
            })
    }

    login(request, response)
    {
        response.render('admin/login');
    }

    doLogin(request, response)
    {
        let User = new UserModel();
        User.connect(
            request.body.email,
            request.body.password)
        .then(function(result)
        {
            if(result == false)
            {
                request.flash('error', "L'identification a échouée :/");

                response.render('admin/login', {
                    email: request.body.email
                });
            }
            else
            {
                // 01/ on enregistre les infos en session
                request.session.user = {
                    connected: true,
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin,
                    lastname: result.lastname,
                    firstname: result.firstname
                };

                // 02/ On crée un jwt pour la session
                const jwtAccessToken = jwt.sign(
                    request.session.user,
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: 604800}
                );

                // On enregistre le jwt en cookie
                new Cookies(request, response).set(
                    'access_token',
                    jwtAccessToken,
                    {httpOnly: true, secure: false}
                );

                // message dans flashbag
                request.flash('success', 'Vous êtes maintenant connecté !');

                // redirect vers l'accueil
                response.redirect('/admin');
            }
        });
    }
}