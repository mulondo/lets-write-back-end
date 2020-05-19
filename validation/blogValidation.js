const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateBlogInput(data) {
    let errors = {}
   
  
    // more work is still required here
    data.text = !isEmpty(data.text) ? data.text: '';
    
    // data.category = typeof(data.category) ==='undefined'? '': data.category

  
    data.category = isEmpty(data.category)? '': data.category;

    data.title = isEmpty(data.title)? '': data.title;

    console.log('++++++++++++++++=',data.category)
    

    if (!Validator.isLength(data.text, {min:10})){
        errors.text = 'blog must be more than to characters';
    }
    
    if(Validator.isEmpty(data.text)) {
        errors.text = 'text is required';
    } 

    if(Validator.isEmpty(data.category)) {
        errors.category = 'category must be selected';
    }

    if(Validator.isEmpty(data.title)) {
        errors.title = 'blog should have a title';
    }
    
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
