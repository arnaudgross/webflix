const MovieModel = require('../models/Movie.js');

module.exports = class Home
{
    home(request, response)
    {
        let Movie = new MovieModel();

        Movie.getAll()
            .then(function(result)
            {
                if(result != false)
                {
                    let cat = '';

                    if(typeof request.params.cat != 'underfined')
                    {
                        cat = request.query.cat || '';
                        result = result.filter(movie => movie.genre.toLowerCase().includes(cat));
                    }

                    response.render('home', {
                        menu: 'home',
                        cat: cat,
                        movies: result });
                }
                else
                {
                    response.render('home', { menu: 'home', error: 'No movie found :/' });
                }
            })
    }

    trendings(request, response)
    {
        response.render('trendings', { menu: 'trendings', error: 'No movie found :/' });
    }

    comingsoon(request, response)
    {
        response.render('comingsoon', { menu: 'comingsoon', error: 'No movie found :/' });
    }

    favourites(request, response)
    {
        response.render('favourites', { menu: 'favourites', error: 'No movie found :/' });
    }

    watchlater(request, response)
    {
        response.render('watchlater', { menu: 'watchlater', error: 'No movie found :/' });
    }
}