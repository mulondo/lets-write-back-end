const dotenv = require('dotenv');
dotenv.config()

module.exports = {
    mongodbUrl: process.env.MONGO_DB_URL,
    secrete: process.env.SECRETE
}
