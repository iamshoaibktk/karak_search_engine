const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');    
const authCon = require('../controllers/authCon');

const date = new Date();
const year = date.getFullYear();
// const currentDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
const ageLimit = year - 12;
router.get('/login', authCon.getLogin);

router.get('/signup', authCon.getSignup);

router.post('/login', body('phnNum').isMobilePhone().withMessage('Enter a Valid Phone Number').isLength({min:10, max:10}).withMessage('Please Enter a Valid Phone Number of length 10').trim(), body('password').isLength({min: 6}).withMessage('Password is required and length should be greater then 6.').trim() , authCon.postLogin);

router.post('/logout', authCon.postLogout);

router.post('/signup', body('fname').isAlpha().withMessage('First Name should contain only letters.').isLength({
        min: 3,
        max: 25
    }).withMessage('Please Enter a Valid First Name'), body('lname').isAlpha().withMessage('Last Name should contain only letters.').isLength({
        min: 3,
        max: 25
    }).withMessage('Please Enter a Valid Last Name'), body('phoneNumber').isMobilePhone('any').withMessage('Enter a Valid Phone Number').isLength({
        min: 10,
        max: 10
    }).withMessage('Please Enter a Valid Phone Number of length 10').trim(),
    body('password').isLength({
        min: 6,
        max: 16
    }).withMessage('Password length should be greater then 6 characters').trim(), 
    body('conPassword').custom((value, { req }) => {
        if(value != req.body.password) {
            throw new Error('Passwords have to match');
        }
        return true;
    }).trim(),
    body('dob').isBefore(ageLimit + '-01-01').withMessage('Your age should be 12 years or greater for Registering').isAfter('1940-01-01').withMessage('Enter Your Real Age.'), authCon.postSignup);

module.exports = router;