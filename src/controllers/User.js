const UserModel = require('../models/User.js');

const jwt = require('jsonwebtoken');
const Cookies = require( "cookies" );

const QRCode = require('qrcode');
const { authenticator } = require('otplib');
const session = require('express-session');
const res = require('express/lib/response');

module.exports = class User
{
    profile(request, response)
    {
        let User = new UserModel();

        User.get(request.session.user.id)
            .then(function(result)
            {
                if(result != false)
                {
                    response.render('user/profile', {
                        menu: 'profile',
                        user:result
                    });
                }
                else
                {
                    request.flash('error', "Le profile n'a pas été trouvé :/");
                    response.redirect('/');
                }
            });
    }

    doProfile(request, response)
    {
        // @todo: implement update

        request.flash('success', "Vos informations ont bien été mises à jour");
        response.redirect('/profile');
        return;
    }

    doubleauth(request, response)
    {
        let User = new UserModel();
        User.get(request.session.user.id)
        .then(function(result)
        {
            if(result != false)
            {
                response.render('user/profile', {
                    menu: 'profile',
                    user:result
                });
            }
            else
            {
                request.flash('error', "Le profile n'a pas été trouvé :/");
                response.redirect('/');
                return;
            }
        });
        
        const UriOTP = authenticator.keyuri(request.session.user._id, 'Webflix', process.env.SECRET_DOUBLEAUTH);

        QRCode.toDataURL(UriOTP, function(err, url)
        {
            if(err)
            {
                request.flash('error', 'Une erreur est survenue.');
                response.redirect('/profile');
                return;
            }

            response.render('user/doubleauth', {
                qrcode: url,
                app_name: 'Webflix',
                userEmail: request.session.user.email,
                secret_doubleauth: process.env.SECRET_DOUBLEAUTH
            });
        });
    }

    doDoubleauth(request, response)
    {
        let User = new UserModel();

        User.get(request.session.user.id)
        .then(function(result)
        {
            if(result != false)
            {
                try
                {
                    const isValid = authenticator.check(request.body.doubleauth, result.doubleauth);
                    // si c'est valide, on peut connecter l'utilisateur
                    // si non valide, recharger la page du formulaire 2FA
                    if(isValid)
                    {
                        request.flash('success', "La double authentificaton a bien été activée");
                        response.redirect('/profile');
                        return;
                    }
                    else
                    {
                        request.flash('error', "L'identification a échoué :/");
                        response.redirect('/doubleauth')
                        return;
                    }
                }
                catch(err)
                {
                    response.end('error : ' + err);
                    return;
                    // recharger la page du formulaire 2FA
                }
            }
            else
            {
                request.flash('error', "Le profile n'a pas été trouvé :/");
                response.redirect('/');
            }
        });
    }

    register(request, response)
    {
        response.render('user/register', {menu: 'register'});
    }

    doRegister(request, response)
    {
        let User = new UserModel();

        User.emailExists(request.body.email)
            .then(function(result)
            {
                if(result === false)
                {
                    // synchronized bcrypt usage
                    let bcrypt = require('bcryptjs');
                    let salt = bcrypt.genSaltSync(10);
                    let hashPassword = bcrypt.hashSync(request.body.password, salt);

                    User.add(
                        request.body.lastname,
                        request.body.firstname,
                        request.body.email,
                        hashPassword,
                        authenticator.generateSecret(),
                        false
                    );

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

                    // 03/ On enregistre le jwt en cookie
                    new Cookies(request, response).set(
                        'access_token',
                        jwtAccessToken,
                        {httpOnly: true, secure: false}
                    );

                    // 04/ On redirige vers le double auth si besoin
                    if(request.body.enableDoubleauth)
                    {
                        request.flash('info', 'Votre compte a bien été créé, il vous reste à activer la double authentification');
                        response.redirect('/doubleauth');
                        return;
                    }
                    else
                    {
                        // message dans flashbag
                        request.flash('success', 'Votre compte a bien été créé !');

                        // redirect vers home
                        response.redirect('/');
                        return;
                    }
                }
                else
                {
                    // reaffichage du formulaire avec message d'erreur et donnée dans formulaire
                    response.render('user/register', {
                        menu: 'register',
                        error: 'Cette adresse email est déjà utilisée :/',
                        lastname: request.body.lastname,
                        firstname: request.body.firstname,
                        email: request.body.email,
                        enableDoubleauth: request.body.enableDoubleauth
                    });
                }
            });
    }

    login(request, response)
    {
        response.render('user/login', {menu: 'login'});
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

                response.render('user/login', {
                    menu: 'login',
                    email: request.body.email
                });
            }
            else
            {
                /*try
                {
                    const isValid = authenticator.check(request.body.doubleauth, result.doubleauth);
                    // si c'est valide, on peut connecter l'utilisateur
                    // si non valide, recharger la page du formulaire 2FA
                    if(isValid)
                    {
                        request.flash('success', "L'identification a réussie youpiiii \o/");
                        response.redirect('/')
                        return;
                    }
                    else
                    {
                        request.flash('error', "L'identification a échouééééé pas youpiiii ");
                        response.redirect('/')
                        return;
                    }
                }
                catch(err)
                {
                    response.end('error : ' + err);
                    return;
                    // recharger la page du formulaire 2FA
                }*/
                

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
                response.redirect('/');
            }
        });
    }

    logout(request, response)
    {
        // 01/ Remove session
        delete request.session.user;

        // 02/ Remove cookies
        new Cookies(request, response).set('access_token', '', 0);

        // 03/ message dans flashbag
        request.flash('info', 'Vous êtes maintenant déconnecté');

        // 04/ redirect vers l'accueil
        response.redirect('/');
    }
}