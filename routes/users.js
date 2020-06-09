const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../Models/Users');
const router = express.Router();
const registerValidation = require('../validation/register');
const validateLoginInput = require('../validation/loginValidation')
const configVariable = require('../config/config')


router.post('/register',cors(), (req, res) => {
    const { username, email, password } = req.body;

    const { errors, isValid } = registerValidation(req.body)
    
    if(!isValid) {
        console.log('---------->error ',errors)
        return res.status(400).json(errors)
    }

    if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
        res.send(errors)
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    res.json({ msg: 'the email aleady exists' })
                } else {
                    const photo = gravatar.url(email, {
                        s: '230',
                        r: 'pg',
                        d: 'mm'
                    });
                    const newUser = new User({
                        username,
                        email,
                        photo,
                        password
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash
                            newUser.save()
                                .then(user => res.status(201).json({ user: user }))
                                .catch(err => res.send(err))
                        })
                    })
                }
            })
    }

});

router.post('/login', (req, res) => {
    console.log('----------->',req.body)
    
    const {isValid, errors} = validateLoginInput(req.body)

    if(!isValid) {
        console.log('---------->error ',errors)
        return res.status(400).json(errors)
    }
    const { email, password } = req.body
    User.findOne({ email })
        .then(user => {
            if (!user.email) {
                res.status(404).json({ msg: 'user not found' })
            } else {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = { id:user.id, email: user.email, username: user.username, school: 'muk', photo: user.photo}
                            /** Generating a JWT
                             * The jwt.sign takes in
                             * 1. The payload
                             * 2. The secrete key
                             * 3. Expiration period which is an object
                             * 4. The call back function which takes in the error and the token
                             */
                            jwt.sign(payload, configVariable.secrete, { expiresIn: 3600 }, (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token,
                                })
                            })
                        } else {
                            console.log('--------------> wrong password---')
                            res.status(401).json({ unauthorized: 'Incorrect email or password' })
                        }
                    })
            }
        })
})
module.exports = router;
