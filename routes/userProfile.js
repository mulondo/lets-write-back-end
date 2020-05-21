const express = require('express');
const router = express.Router()
const Profile = require('../Models/UserProfile')
const passport = require('passport')
const Users = require('../Models/Users')


/**
 * @Route Get api/profile
 * @Description get current user profile
 * @Access private
 */
router.get('/', passport.authenticate('jwt',({session: false})), (req,res) => {
    Profile.findOne({user: req.user.id})
    .then(profile => {
        if(!profile) {
            res.status(404).json({error: 'profile not find'})
        }
        res.send(profile)
    })
    .catch(error => res.status.json(error))
})
module.exports = router