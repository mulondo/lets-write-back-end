const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors')
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

// const corsOptions = {
// 	credentials: true,
// 	origin: '*',
// 	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };


const app = express()

app.use(cors());

// app.use(cors())
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())
require('./config/passport')(passport)


app.use('/api/auth/', users)
app.use('/api/blogs/', blog)
app.use('/api/profile',userprofile)

const port = process.env.PORT || 3400

app.listen(port, ()=> {
    console.log('running on ', port)
}) 

module.exports = app;
