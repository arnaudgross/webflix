module.exports = class Auth
{
    _request;
    _response;

    constructor(request, response)
    {
        this.request = request;
        this.response = response;
    }

    set request(request)
    {
        this._request = request;
    }

    set response(response)
    {
        this._response = response;
    }

    get request()
    {
        return this._request;
    }

    get response()
    {
        return this._response;
    }

    static doLogin(user, request, response)
    {
        this.request = request || this.request;
        this.response = response || this.response;

        // 01/ on enregistre les infos en session
        request.session.user = user;

        // 02/ On crée un jwt pour la session
        const jwtAccessToken = request.jwt.sign(
            user,
            process.env.JWT_SECRET_KEY,
            {expiresIn: 604800}
        );

        // On enregistre le jwt en cookie
        new request.Cookies(request, response).set(
            'access_token',
            jwtAccessToken,
            {httpOnly: true, secure: false}
        );
    }

    static doLogout(request, response)
    {
        // 01/ Remove session
        delete request.session.user;

        // 02/ Remove cookies
        new request.Cookies(request, response).set('access_token', '', 0);
    }

    static checkLoggedin(request, response)
    {
        this.request = request || this.request;
        this.response = response || this.response;

        // 01/ Récupération du token dans le cookie
        let accessToken = new request.Cookies(request,response).get('access_token');

        // 02/ Si le cookie (access_token) n'existe pas
        if(accessToken == null)
        {
            response.redirect('/login');
            return;
        }

        // 03/ Sinon on vérifie le JWT
        return request.jwt.verify(accessToken, process.env.JWT_SECRET_KEY, function(error, dataJwt)
        {
            // error = pas un jwt ou modifié ou expiré
            if(error)
            {
                request.flash('error', "403: Vous n'avez pas les accès nécessaires");
                response.redirect('/login');
                return;
            }

            // user is logged in
            if(typeof dataJwt != 'undefined')
            {
                // recreate session if is loggedin
                request.session.user = dataJwt;
                return true;
            }
            // user is not logged in
            else
            {
                request.flash('error', "Vous n'avez pas les accès nécessaires");
                response.redirect('/login');
                return;
            }
        });
    }

   static checkAdmin(request, response)
    {
        this.request = request || this.request;
        this.response = response || this.response;

        // 01/ Récupération du token dans le cookie
        let accessToken = new request.Cookies(request,response).get('access_token');

        // 02/ Si le cookie (access_token) n'existe pas
        if(accessToken == null)
        {
            response.redirect('/admin/login');
            return;
        }

        // 03/ Sinon on vérifie le JWT
        return request.jwt.verify(accessToken, process.env.JWT_SECRET_KEY, function(error, dataJwt)
        {
            // error = pas un jwt ou modifié ou expiré
            if(error)
            {
                request.flash('error', "403: Vous n'avez pas les accès nécessaires");
                response.redirect('/admin/login');
                return;
            }

            if(typeof dataJwt != 'undefined')
            {
                // recreate session if is loggedin
                request.session.user = dataJwt;
            }

            // user is admin
            if(typeof dataJwt != 'undefined'
                && typeof dataJwt.isAdmin != 'undefined'
                && dataJwt.isAdmin == true
            )
            {
                return true;
            }
            // user is not admin
            else
            {
                request.flash('error', "Vous n'avez pas les accès nécessaires");
                response.redirect('/admin/login');
                return;
            }
        });
    }

    static checkOwner(user_id, request, response)
    {
        // @todo: implement check owner
    }
}