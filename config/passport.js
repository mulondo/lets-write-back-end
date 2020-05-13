const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../Models/Users')
const configVariable = require('../config/config')

const opts = {}

opts.secretOrKey = configVariable.secrete
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
          .then(user => {
              if(user) {
                  return done(null, user)
              } else {
                  return done(null, false)
              }
          })
          .catch(err => console.log(err))
    }))
}