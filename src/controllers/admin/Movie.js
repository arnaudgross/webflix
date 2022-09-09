const MovieModel = require('../../models/Movie.js');

module.exports = class AdminMovie
{
    add(request, response)
    {
        response.render('admin/movies/add');
    }

    doAdd(request, response)
    {
        let Movie = new MovieModel();

        Movie.add(
            request.body.id_tmdb,
            request.body.title,
            request.body.path,
            request.body.year,
            request.body.genre,
            request.body.actors,
            request.body.synopsis,
            request.body.affiche
        );

        // message dans flashbag
        request.flash('success', 'Le film a bien été enregistré !');

        // redirect vers la home
        response.redirect('/admin');
    }

    edit(request, response)
    {
        let Movie = new MovieModel();
        
        Movie.get(request.params.movie_id)
        .then(function(result)
        {
            if(result != false)
            {
                response.render('admin/movies/edit', {
                    id_tmdb: result.id_tmdb,
                    title: result.title,
                    path: result.path,
                    year: result.year,
                    genre: result.genre,
                    actors: result.actors,
                    synopsis: result.synopsis,
                    affiche: result.affiche
                });
            }
            else
            {
                request.flash('error', "Le film n'a pas été trouvé :/");
                response.redirect('/admin');
            }
        });
    }

    doEdit(request, response)
    {
        let Movie = new MovieModel();

        Movie.update(
            request.body.id_tmdb,
            request.body.title,
            request.body.path,
            request.body.year,
            request.body.genre,
            request.body.actors,
            request.body.synopsis,
            request.body.affiche
        ).then(function(data)
        {
            if(data === true)
            {
                request.flash('success', "Le film a bien été modifié !");
            }
            else
            {
                request.flash('error', "Le film n'a pas pu être trouvé :/");
            }

            response.redirect('/admin');
        });
    }

    doDelete(request, response)
    {
        let Movie = new MovieModel();

        Movie.delete(request.params.movie_id)
        .then(function(result)
        {
            if(result === true)
            {
                request.flash('success', "Le film a bien été supprimé !");
            }
            else
            {
                request.flash('error', "Le film n'a pas pu être supprimé :/");
            }

            response.redirect('/admin');
        });
    }
}