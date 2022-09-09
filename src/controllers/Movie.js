const MovieModel = require('../../models/Movie.js');

module.exports = class Movie
{
    view(request, response)
    {
        // @todo retreive the current movie

        response.render('movies/view');
    }
}