const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const gravatar = require('gravatar');
const User = require('../Models/Users')
const registerValidation = require('../validation/register')

const router = express.Router();


router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const { errors, isValid } = registerValidation(req.body)


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
                        name,
                        email,
                        photo,
                        password
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
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
module.exports = router;
