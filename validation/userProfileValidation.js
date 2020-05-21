const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateBlogInput(data) {
    let errors = {}
   
  
    // more work is still required here
    data.text = !isEmpty(data.text) ? data.text: '';
    
    // data.category = typeof(data.category) ==='undefined'? '': data.category

    inspiration = isEmpty(data.inspiration)? '': data.inspiration
    handle  = isEmpty(data.handle)? '': data.handle
    hobbies = isEmpty(data.hobbies)? '': data.hobbies
    bio = isEmpty(data.bio)? '': data.bio
    status = isEmpty(data.status)? '': data.status
    company = isEmpty(data.company)? '': data.company
    

    if (!Validator.isLength(data.handle, {min:2, max:80})){
        errors.handle = 'handle must be at least 2 or more characters';
    }

    if (Validator.isEmpty(data.handle)){
        errors.handle = 'handle field is missing';
    }

    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = 'Url is invalid'
        }
    }

    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube = 'Url is invalid'
        }
    }

    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = 'Url is invalid'
        }
    }
    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram = 'Url is invalid'
        }
    }
    
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
