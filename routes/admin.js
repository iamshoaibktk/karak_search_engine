const path = require('path');
const {body} = require('express-validator');
const express = require('express');

const rootDir = require('../util/path');
const mainData = require('./main');
const adminCon = require('../controllers/adminCon');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
// creation of router object


// router.post('/dashboard', adminCon.postDashboard);
router.get('/dashboard', isAuth.isLogedIn, adminCon.getDashboard);
// router.post('/loginToDashboard', adminCon.loginToDashboard);
// router.post('/userRegister', adminCon.userRegister);
router.get('/profile', isAuth.isLogedIn, adminCon.profile);
router.post('/editProfile/:profileId', isAuth.isLogedIn, adminCon.getEditProfileForm);
router.post('/editProfileSubmit/:profileId', isAuth.isLogedIn,  body('fname').isAlpha().withMessage('Name should contain only letters.').isLength({
    min: 3,
    max: 25
}).withMessage('Please Enter a Valid Name').trim(), body('lname').isAlpha().withMessage('Name should contain only letters.').isLength({
    min: 3,
    max: 25
}).withMessage('Please Enter a Valid Name').trim(), body('phoneNumber').isMobilePhone('any').withMessage('Enter a Valid Phone Number').isLength({
    min: 10,
    max: 10
}).withMessage('Please Enter a Valid Phone Number of length 10').trim(), adminCon.editProfile);
router.get('/addEntity', isAuth.isLogedIn, adminCon.addEntity);
router.post('/addingEntity', isAuth.isLogedIn, body('title').isLength({min:3}).withMessage('please enter title more then 2 alphabets'),
                                     body('category').isLength({min:3}).withMessage('Category length Must be greater then 3 alphabets'),
                                     body('address').isLength({min:3}).withMessage('address must contain atleast 3 alphabets'),
                                     body('entityPhnNum', 'Please Enter Correct Phone Number').isMobilePhone().isLength({min:10, max:10}),
                                     body('EopeningTime').custom((value, {req}) => {
                                         if(value == req.body.EclosingTime) {
                                             throw new Error('Opening and Closing Time are Same');
                                         } 
                                         return true;
                                     }) ,adminCon.addingEntity);
                                    //  .isAlpha().withMessage('Category Must contain only alphabets')
// router.get('/editPost/:postId', isAuth.isLogedIn ,adminCon.getEditForm);
router.post('/editPost/:postId', isAuth.isLogedIn ,adminCon.getEditForm);
router.post('/editSubmit/', isAuth.isLogedIn, 
                                    body('title').isLength({min:3}).withMessage('please enter title more then 2 alphabets'),
                                    body('category').isAlpha().withMessage('Category Must contain only alphabets').isLength({min:3}).withMessage('Category length Must be greater then 3 alphabets'),
                                    body('address').isLength({min:3}).withMessage('address must contain atleast 3 alphabets'),
                                    body('entityPhnNum', 'Please Enter Correct Phone Number').isMobilePhone().isLength({min:10, max:10}),
                                    body('EopeningTime').custom((value, {req}) => {
                                        if(value == req.body.EclosingTime) {
                                            throw new Error('Opening and Closing Time are Same');
                                        } 
                                        return true;
                                }), adminCon.editPost);
router.post('/deletePost/:postId', isAuth.isLogedIn, adminCon.deletePost);
router.post('/reportPost/:postId', isAuth.isLogedIn, adminCon.reportPost);
router.get('/reports', isAuth.adminIsLogedIn, adminCon.reports);
router.get('/allEntities', isAuth.adminIsLogedIn, adminCon.allEntities);
router.get('/allUsers', isAuth.adminIsLogedIn, adminCon.allUsers);
router.get('/deleteUser/:userId', isAuth.adminIsLogedIn, adminCon.deleteUser);
router.get('/viewReportedPost/:postId', isAuth.adminIsLogedIn, adminCon.viewReportedPost);
router.post('/deleteReport/:reportId', isAuth.adminIsLogedIn, adminCon.deleteReport);

module.exports = router;