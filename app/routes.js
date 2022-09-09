const { response } = require('../src/services/Auth.tmp.js');
const jwtVerify = require('../src/middlewares/jwtVerify.js');
const authentification = require('../src/middlewares/authentification.js');

module.exports = (app) => {

    /* --- HOME --- */
    
    app.get('/', function(req, res)
    {
        let Home = require('../src/controllers/Home.js');
        let Controller = new Home();
        Controller.home(req, res);
        
    });

    app.get('/trendings', function(req, res)
    {
        let Home = require('../src/controllers/Home.js');
        let Controller = new Home();
        Controller.trendings(req, res);
        
    });

    app.get('/comingsoon', function(req, res)
    {
        let Home = require('../src/controllers/Home.js');
        let Controller = new Home();
        Controller.comingsoon(req, res);
        
    });

    app.get('/register', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.register(req, res);
    })

    app.post('/register', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.doRegister(req, res);
    })

    app.get('/login', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.login(req, res);
    });

    app.post('/login', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.doLogin(req, res);
    });


    // Mandatory connexion for user section
    app.use('/', authentification);

    app.get('/favourites', function(req, res)
    {
        let Home = require('../src/controllers/Home.js');
        let Controller = new Home();
        Controller.favourites(req, res);
        
    });

    app.get('/watchlater', function(req, res)
    {
        let Home = require('../src/controllers/Home.js');
        let Controller = new Home();
        Controller.watchlater(req, res);
        
    });
    

    /* --- MOVIES --- */

    app.get('/movies/:movie_id', function(req, res)
    {
        let Movie = require('../src/controllers/Movie.js');
        let Controller = new Movie();
        Controller.list(req, res);
    })

    /* --- USER ---*/

    app.get('/profile', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.profile(req, res);
    })

    app.post('/profile', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.doProfile(req, res);
    });

    app.get('/doubleauth', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.doubleauth(req, res);
    })

    app.post('/doubleauth', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.doDoubleauth(req, res);
    });

    app.get('/logout', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.logout(req, res);
    });

    app.get('/userdelete', function(req, res)
    {
        let User = require('../src/controllers/User.js');
        let Controller = new User();
        Controller.userdelete(req, res);
    });

    /* --- ADMIN --- */

    app.get('/admin', function(req, res)
    {
        let AdminIndex = require('../src/controllers/admin/Index.js');
        let Controller = new AdminIndex();
        Controller.index(req, res);
    })

    app.get('/admin/login', function(req, res)
    {
        let AdminIndex = require('../src/controllers/admin/Index.js');
        let Controller = new AdminIndex();
        Controller.login(req, res);
    })

    app.post('/admin/login', function(req, res)
    {
        let AdminIndex = require('../src/controllers/admin/Index.js');
        let Controller = new AdminIndex();
        Controller.doLogin(req, res);
    })

    // Mandatory admin connexion for admin section
    app.use('/admin/', jwtVerify);

    /* --- ADMIN MOVIES --- */

    app.get('/admin/movies/add', function(req, res)
    {
        let AdminMovie = require('../src/controllers/admin/Movie.js');
        let Controller = new AdminMovie();
        Controller.add(req, res);
    })

    app.post('/admin/movies/add', function(req, res)
    {
        let AdminMovie = require('../src/controllers/admin/Movie.js');
        let Controller = new AdminMovie();
        Controller.doAdd(req, res);
    });

    app.get('/admin/movies/:movie_id', function(req, res)
    {
        let AdminMovie = require('../src/controllers/admin/Movie.js');
        let Controller = new AdminMovie();
        Controller.edit(req, res);
    })

    app.post('/admin/movies/:movie_id', function(req, res)
    {
        let AdminMovie = require('../src/controllers/admin/Movie.js');
        let Controller = new AdminMovie();
        Controller.doEdit(req, res);
    })

    app.get('/admin/movies/delete/:movie_id', function(req, res)
    {
        let AdminMovie = require('../src/controllers/admin/Movie.js');
        let Controller = new AdminMovie();
        Controller.doDelete(req, res);
    })
}