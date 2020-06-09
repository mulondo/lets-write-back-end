const express = require('express');
const router = express.Router()
const Profile = require('../Models/UserProfile')
const passport = require('passport')
const Users = require('../Models/Users')
const validation = require('../validation/userProfileValidation')
const experienceValidation = require('../validation/experienceValidation')

/**
 * @Route Get api/profile/all
 * @Description get all the users profiles
 * @Access public 
 */
router.get('/all',(req,res) => {
    Profile.find()
    .populate('user',['username', 'photo'])
    .then(profile => {
        if(!profile) {
            res.json({error: 'there are no profiles'})
        } else {
            res.json(profile)
        }
    })
})

/**
 * @Route Get api/profile
 * @Description get current user profile
 * @Access private
 */
router.get('/', passport.authenticate('jwt',({session: false})), (req,res) => {
    Profile.findOne({user: req.user._id})
    .populate('user',['username','photo'])
    .then(profile => {
        if(!profile) {
            res.status(404).json({error: 'profile not find'})
        }
        res.send(profile)
    })
    .catch(error => res.status().json(error))
})

/**
 * @Route Post api/profile
 * @Description create user profile
 * @Access private
 */
router.post('/',passport.authenticate('jwt',({session: false})), (req, res) => {
    const fields = {}
    const {isValid,errors} = validation(req.body)

    if(!isValid) {
        return res.json(errors)
    }
    fields.user = req.user.id
    if(req.body.handle) fields.handle = req.body.handle
    if(req.body.bio) fields.bio = req.body.bio
    if(req.body.status) fields.status = req.body.status
    if(req.body.company) fields.company = req.body.company
    if(typeof req.body.hobbies !== 'undefined') fields.hobbies = req.body.hobbies.split(',');
    if(typeof req.body.inspiration !== 'undefined') fields.inspiration = req.body.inspiration.split(',');

    // social links
    fields.social = {}
    if(req.body.facebook) fields.social.facebook = req.body.facebook
    if(req.body.youtube) fields.social.youtube = req.body.youtube
    if(req.body.twitter) fields.social.twitter = req.body.twitter
    if(req.body.instagram) fields.socail.instagram = req.body.instagram

    Profile.findOne({user: req.user.id})
      .then(profile => {
          if(profile){
              //update userprofile if it exists
            Profile.findOneAndUpdate(
                {user:req.user.id}, 
                {$set: fields}, 
                {new: true}
            )
              .then(prof => res.status(201).json(prof))
              .catch(err => res.json(err))
            
          } else {
              // create userprofile if it doeesn't exit
            Profile.findOne({handle: fields.handle})
              .then(profile => {
                  if(profile){
                      res.status(400).json({error: 'the profile handle already exists'})
                  } else {
                      new Profile(fields).save()
                      .then(profile => res.status(200).json(profile))
                      .catch(error => res.json(error))
                  }

              })
          }
      })
})

/**
 * @Route Get api/profile/handle/:handle
 * @Description get the user profile by handle
 * @Access public 
 */
router.get('/handle/:handle',(req,res) => {
    Profile.findOne({handle: req.params.handle})
    .populate('user',['username', 'photo'])
    .then(profile => {
        if(!profile) {
            res.json({error: `Userprofile with ${req.params.handle} doesn't exist`})
        } else {
            res.json(profile)
        }
    })
})


/**
 * @Route Get api/profile/userId/:id
 * @Description get the user r by handle
 * @Access public 
 */
router.get('/user/:userId',(req,res) => {
    Profile.findOne({user: req.params.userId})
    .populate('user',['username', 'photo'])
    .then(profile => {
        if(!profile) {
            res.json({error: `Userprofile with ${req.params.userId} doesn't exist`})
        } else {
            res.json(profile)
        }
    })
})

/**
 * @Route Post api/profile/experience
 * @Description add experience
 * @Access private
 */
router.post('/experience',passport.authenticate('jwt',({session: false})),(req,res) => {
    const {errors, isValid} = experienceValidation(req.body)
    if(!isValid){
        res.status(400).json(errors)
    }
    Profile.findOne({user: req.user.id})
    .then(profile => {
        const {title, company, from, to, current} = req.body
        const values = {
            title, 
            company, 
            from, 
            to, 
            current
        }
        profile.experience.unshift(values)
        profile.save()
        .then(prof => res.json(prof))
        .catch(err => res.send(err))
    })
    .catch(error => res.json(error))
})

/**
 * @Route Delete api/profile/experience/:id
 * @Description delete experience
 * @Access private
 */
router.delete('/experience/:id',passport.authenticate('jwt',({session: false})),(req,res) => {
    
    Profile.findOne({user: req.user.id})
    .then(profile => {
        const deleteExperience = profile.experience.find(exp => exp.id === req.params.id)
        profile.experience.splice(deleteExperience,1)
        profile.save()
        .then(del => res.status(200).json(del))
    })
    .catch(error => res.json(error))
})
module.exports = router
