const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {}
    // // console.log('==4-4-4-4==34--===================>',isEmpty(data.email))
    // data.email = !isEmpty(data.email) ? data.email: 'vfev';
    // console.log('--------------------------------->', data.email)
  
    // more work is still required here
    data.email = !isEmpty(data.email) ? data.email: '';
    // console.log('-------------------------->', data.email)
    data.password = !isEmpty(data.password) ? data.password: '';
    
    //email validation
    if (!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }
    
    if(validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    } 
    
    // password validation
    if(validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(validator.isEmpty(data.name)) {
        errors.name = 'name is required'
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
