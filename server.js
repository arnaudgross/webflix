const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();


/* --- MOTEUR DE TEMPLATE --- */

app.set('views', path.join(__dirname, 'templates')); // pas besoin de cette ligne si le dossier est "views"
app.set('view engine', 'pug');


/* --- SASS MIDDLEWARE (/!\ doit être placé avant le système de statics) --- */

const sassMiddleware = require('node-sass-middleware');
app.use(sassMiddleware(
{
    // options
    src: path.join(__dirname, 'build/'),
    dest: path.join(__dirname, 'public/'),
    debug: true,   // true pour voir les traitements effectués
    indentedSyntax: false, // true Compiles files with the .sass extension
    outputStyle: 'compressed'
}));


/* --- BODY PARSER MIDDLEWARE --- */

/*const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));*/
app.use(express.urlencoded({extended:true}));

/* --- EXPRESS SESSION MIDDLEWARE --- */

const session = require('express-session');
app.use(session({
    secret: process.env.APP_KEY, resave:false, saveUninitialized:false, 
    cookie: {maxAge: 3600000} 
}));

// [DEV ENV ONLY] force a fake session
/*if(process.env.APP_ENV === 'dev')
{
    app.use(function(req,res,next)
    {
        req.session.user = {
            connected: true,
            id: '62705644ca14910b0bd61543',
            email: 'bimbam@boum.com',
            isAdmin: true,
            lastname: 'Cauvin',
            firstname: 'Corentin'
        };
        next();
    });
}


/* --- EXPRESS FLASH MESSAGES MIDDLEWARE --- */

const flash = require('express-flash-messages');
app.use(flash());

// permet de renvoyer les sessions à la vue
app.use((req,res,next) => {res.locals.session = req.session; next();});


/* --- JWT MIDDLEWARE --- */

/*app.use((req,res,next) => {
    req.jwt = require('jsonwebtoken');
    req.Cookies = require( "cookies" );
    next();
});*/


/* --- AUTH CUSTOM MIDDLEWARE --- */

/*app.use((req,res,next) => {
    req.Auth = require('./src/services/Auth.js');
    next();
});*/


/* --- REPERTOIRE STATIC (= le navigateur pourra accéder à ce répertoire) --- */

app.use(express.static(path.join(__dirname, 'public')));


/* --- CONNEXION MONGODB --- */

const mongoose = require('mongoose')
mongoose.connect(
    process.env.URI_MONGODB, 
    {connectTimeoutMS: 3000, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
)
mongoose.connection.once('open', () =>  {
    console.log(`Connexion au serveur MongoDB OK`)
})


/* --- ROUTES --- */

require('./app/routes')(app);


/* --- ECOUTE SERVEUR HTTP --- */

app.listen(process.env.PORT, function()
{
    console.log(`Le serveur est démarré : http://localhost:${process.env.PORT}`);
});