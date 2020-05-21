const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const Blog = require('../Models/Blog')
const ValidateBlog = require('../validation/blogValidation')


/**
 * @Route Get api/blogs
 * @Description Get all blogs
 * @Access public
 */
router.get('/', (req,res) => {
    Blog.find()
      .sort({date: -1})
      .then(blogs => res.json(blogs))
      .catch(errors => res.json(errors))
})

/**
 * @Route Get api/blogs/id:
 * @Description Get single blog
 * @Access public
 */
router.get('/:id', (req,res) => {
    Blog.findById(req.params.id)
      .then(blog => res.json(blog))
      .catch(errors => res.status(404).json({Message:"Blog Not Found"}))
})

/**
 * @Route Post api/blog
 * @Description Create a blog
 * @Access Private
*/
router.post('/',passport.authenticate('jwt',{session: false}), (req,res) => {
    const {errors,isValid} = ValidateBlog(req.body)
    
    if(!isValid) {
        return res.status(400).json(errors)
    }

    const newBlog = new Blog({
        text: req.body.text,
        category: req.body.category,
        title: req.body.title
    })
    newBlog.save()
        .then(blog => res.json(blog))
        .catch(errors => res.json(errors))
})

module.exports = router
