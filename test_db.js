const mongoose = require('mongoose');
mongoose.connect(
    'mongodb+srv://cocomongo:Qij7UvEddjRhuPpS@cluster0.i85ml.mongodb.net/webflix?retryWrites=true&w=majority', 
    {connectTimeoutMS : 3000, socketTimeoutMS: 20000, useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.once('open', () => {
   console.log(`connexion OK !`);
});