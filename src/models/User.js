const UserMongo = require('./UserMongoDB.js');

module.exports = class User
{
    add(lastname, firstname, email, hashPassword, doubleauthKey, doubleauthEnabled)
    {
        /* // asynchrone bcrypt usage 
        let bcrypt = require('bcryptjs');
        bcrypt.genSalt(10, function(err, salt)
        {
            bcrypt.hash(password, salt, function(err, hash)
            {*/
                return UserMongo.create({
                    lastname,
                    firstname,
                    email,
                    password: hashPassword,
                    doubleauthKey,
                    doubleauthEnabled
                });
            /*});
        });*/
    }

    emailExists(email)
    {
        return new Promise(function(resolve, reject)
        {
            UserMongo.findOne({email}, function(err, User)
            {
                // si pas d'erreur = email trouvé
                if(!err && User !== null)
                {
                    resolve(true);
                }

                resolve(false);
            });
        });
    }

    connect(email, password)
    {
        return new Promise(function(resolve, reject)
        {
            UserMongo.findOne({email}, function(err, user)
            {
                // si pas d'erreur email trouvé
                if(!err && user !== null)
                {
                    let bcrypt = require('bcryptjs');
                    if(bcrypt.compareSync(password, user.password))
                    {
                        resolve(user);
                    }
                }

                resolve(false);
            });
        });
    }

    get(user_id)
    {
        return new Promise(function(resolve, rejecf)
        {
            UserMongo.findOne({_id:user_id}, function(err, user)
            {   
                if(!err && user != null)
                {
                    resolve(user);
                }

                resolve(false);
            })
        })
    }
}