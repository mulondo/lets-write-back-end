const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const users = require('./routes/users');
const passport = require('passport');
// configure mongo db
const dbUrl = config.mongodbUrl
mongoose.connect(dbUrl)
  .then(()=> console.log('MongDB successfully connected'))
  .catch(err => console.log(err));

// configure .env 
dotenv.config()

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
require('./config/passport')(passport)

app.use('/api/auth/', users)

const port = process.env.PORT || 3200

app.listen(port, ()=> {
    console.log('running on ', port)
})

module.exports = app;
