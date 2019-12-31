const path = require('path');
const rootDir = require('../util/path');
const mainCon = require('../controllers/mainCon');
const {body} = require('express-validator')
const express = require('express');
const router = express.Router();

router.get('/', mainCon.home);
router.get('/searchResults' , mainCon.searchResults);
router.get('/profile/:profileId', mainCon.getProfile);
// router.get('/register', mainCon.getRegister);
// router.get('/login', mainCon.login);
    

exports.routes = router;

// body('keywords').isAlpha().withMessage('Enter KeyWords for Searching'),