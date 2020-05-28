const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {}
   
    
    handle  = isEmpty(data.handle)? '': data.handle
    inspiration = isEmpty(data.inspiration)? '': data.inspiration
    hobbies = isEmpty(data.hobbies)? '': data.hobbies
    bio = isEmpty(data.bio)? '': data.bio
    status = isEmpty(data.status)? '': data.status
    company = isEmpty(data.company)? '': data.company
    

    if (!Validator.isLength(handle, {min:2, max:80})){
        errors.handle = 'handle must be at least 2 or more characters';
    }

    if (Validator.isEmpty(handle)){
        errors.handle = 'profile handle is missing';
    }

    if(!isEmpty(data.facebook)){
        if(!Validator.isURL(facebook)){
            errors.facebook = 'Url is invalid'
        }
    }

    if(!isEmpty(data.youtube)){
        if(!Validator.isURL(youtube)){
            errors.youtube = 'Url is invalid'
        }
    }

    if(!isEmpty(data.twitter)){
        if(!Validator.isURL(twitter)){
            errors.twitter = 'Url is invalid'
        }
    }
    if(!isEmpty(data.instagram)){
        if(!Validator.isURL(instagram)){
            errors.instagram = 'Url is invalid'
        }
    }
    
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
