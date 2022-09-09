const MovieMongo = require('./MovieMongoDB.js');

module.exports = class Movie
{
    add(id_tmdb, title, path, year, genre, actors, synopsis, affiche)
    {      
        return MovieMongo.create({
            id_tmdb,
            title,
            path,
            year,
            genre,
            actors,
            synopsis,
            affiche
        });
    }


    update(id_tmdb, title, path, year, genre, actors, synopsis, affiche)
    {
        return new Promise(function(resolve, reject)
        {
            MovieMongo.findOneAndUpdate({id_tmdb}, {
                title:title,
                path:path,
                year:year,
                genre:genre,
                actors:actors,
                synopsis:synopsis,
                affiche:affiche
            }, function(err, result)
            {
                if(!err)
                {
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            })
        });
    }

    delete(id_tmdb)
    {
        return new Promise(function(resolve, reject)
        {
            MovieMongo.findOneAndDelete({id_tmdb}, function(err, result)
            {
                if(!err)
                {
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            });
        });
    }

    getAll()
    {
        return new Promise(function(resolve, reject)
        {
            MovieMongo.find({}, function(err, result)
            {
                resolve(result);

                /*

                if(!err && result !== null)
                {
                    resolve(result);
                }

                reject(false);
                */
            });
        });
    }

    get(path)
    {
        return new Promise(function(resolve, reject)
        {
            MovieMongo.findOne({'path':path}, function(err, movie)
            {
                if(!err && movie !== null)
                {
                    resolve(movie);
                }
                else
                {
                    resolve(false);
                }
            })
        });
    }
}