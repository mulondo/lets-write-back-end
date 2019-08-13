const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const config = require('./config/config');
// configure mongo db
const dbUrl = config.mongodbUrl
mongoose.connect(dbUrl)
  .then(()=> console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

dotenv.config()

const app = express()

const port = process.env.PORT || 3200

app.listen(port, ()=> {
    console.log('running on ', port)
})
