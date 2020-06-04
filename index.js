const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const users = require('./routes/users');
const blog = require('./routes/blogPost')
const userprofile = require('./routes/userProfile')
const passport = require('passport');

// configure mongo db
const dbUrl = config.mongodbUrl

mongoose.connect(dbUrl)
  .then(()=> console.log('MongDB successfully connected'))
  .catch(err => console.log('========>',err));

// configure .env 
dotenv.config()

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
require('./config/passport')(passport)


app.use('/api/auth/',cors(), users)
app.use('/api/blogs/',cors(), blog)
app.use('/api/profile',cors(),userprofile)

const port = process.env.PORT || 3400

app.listen(port, ()=> {
    console.log('running on ', port)
}) 

module.exports = app;
