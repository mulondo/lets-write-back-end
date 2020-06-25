const express = require('express');
const router = express.Router()
const passport = require('passport')
const Blog = require('../Models/Blog')
const ValidateBlog = require('../validation/blogValidation')
const Profile = require('../Models/UserProfile')


/**
 * @Route Get api/blogs
 * @Description Get all blogs
 * @Access public
 */
router.get('/', (req,res) => {
    console.log('-----',req.user)
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
    console.log('this is the user =============> ', req)
    const {errors,isValid} = ValidateBlog(req.body)
    
    if(!isValid) {
        return res.status(400).json(errors)
    }

    const newBlog = new Blog({
        text: req.body.text,
        category: req.body.category,
        title: req.body.title,
        user: req.user.id
    })
    newBlog.save()
        .then(blog => res.json(blog))
        .catch(errors => res.json(errors))
})


/**
 * @Route Put api/blog
 * @Description Update a blog
 * @Access Private
*/
router.put('/:blogId',passport.authenticate('jwt',{session: false}), (req,res) => {
    const newBlog = {
        text: req.body.text,
        category: req.body.category,
        title: req.body.title,
        user: req.user.id
    }
    Profile.findOne({user: req.user.id})
      .then(profile => {
          if(profile.user.toString()!== req.user.id){
              return res.status(401).json({not_authorized: 'Not authorized'})
          }
          Blog.findOneAndUpdate(
              {_id:req.params.blogId},
              {$set:newBlog},
              {new: true}
            )
            .then(blog => {
                res.json({updated: 'successful',blog:blog})

            })
      })
})

/**
 * @Route Delete api/blog/blogId
 * @Description delete a blog
 * @Access Private
*/
router.delete('/:blogId',passport.authenticate('jwt',{session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
      .then(profile => {
          if(profile.user.toString()!== req.user.id){
              return res.status(401).json({not_authorized: 'Not authorized'})
          }
          Blog.findById(req.params.blogId)
            .then(blog => {
                blog.remove()
                  .then(()=>res.json({message: 'sucessfully deleted'}))
                  .catch(error => res.json({error: error}))

            })
      })
})

/**
 * @Route Post api/blog/like/:id
 * @Description like a blog
 * @Access Private
*/
router.post('/like/:id',passport.authenticate('jwt',{session: false}), (req,res) => {
    
    Blog.findById(req.params.id)
    .then(blog => {
        if(blog.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        const removeIndex = blog.likes.map(item => item.user.toString()).indexOf(req.user.id)

        blog.likes.splice(removeIndex, 1)
        return (blog.save()
            .then(results => res.json({success: true,results})))
        } 
        blog.likes.unshift({user:req.user.id})

        blog.save()
        .then(results => res.json({success: true,results}))
        
        
    })
    .catch(err => res.json({error:err}))
})

/**
 * @Route Post api/blog/like/:id
 * @Description like a blog
 * @Access Private
*/
router.post('/unlike/:id',passport.authenticate('jwt',{session: false}), (req,res) => {

    Blog.findById(req.params.id)
    .then(blog => {
        if(blog.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({alreadyliked: 'you need to first like it'})
        } 
        const removeIndex = blog.likes.map(item => item.user.toString()).indexOf(req.user.id)

        blog.likes.splice(removeIndex, 1)
        blog.save()
        .then(results => res.json({success: true,results}))
        // return res.json({liked: 'successfully'})
        
    })
    .catch(err => res.json({error:err}))
})


/**
 * @Route Post api/blog/comment/:id
 * @Description comment to a blog
 * @Access Private
*/

router.post('/comment/:id',passport.authenticate('jwt',{session: false}), (req,res) => {
    
    Blog.findById(req.params.id)
    .then(blog => {
        const comment = {
            text: req.body.text,
            name: req.user.name,
            photo: req.user.photo,
            user:req.user.id
        }
        blog.comments.unshift(comment)
        blog.save()
            .then(results => res.json({success: true,results}))
        })
    .catch(() => res.json({error:'blog not found'}))
})


/**
 * @Route Post api/blog/comment/:id
 * @Description comment to a blog
 * @Access Private
*/

router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session: false}), (req,res) => {
    console.log('----------------> ',req)
    Blog.findById(req.params.id)
    .then(blog => {

        // if(blog.comments.filter(comment => comment._id.toString() === res.params.comment_id).length() ===0){
        //     return res.status(404).json({message: 'comment not found'})
        // }

        const removeIndex = blog.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)
        blog.comments.splice(removeIndex, 1)
        blog.save()
            .then(results => res.json({success: true,results}))
        })
    .catch(() => res.json({error:'blog not found'}))
})

module.exports = router
