const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {}

    title  = isEmpty(data.title)? '': data.title
    from = isEmpty(data.from)? '': data.from
    

    if (Validator.isEmpty(title)){
        errors.title = 'job title is missing';
    }
    if (Validator.isEmpty(from)){
        errors.from = 'from date is missing';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
