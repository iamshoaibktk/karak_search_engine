const entitiesMod = require('../models/entitiesMod');
const {validationResult} = require('express-validator');
const userMod = require('../models/usersMod');

exports.home = (req, res, next) =>{
  const logedIn = req.session.isLogedIn;
  entitiesMod.category()
  .then(([rows]) => {
    res.render('main/main', {
      pageTitle: 'KSE | Welcome',
      registerNav: true,
      loginNav: true,
      logedIn: logedIn,
      addEntityNav: true,
      dashboardNav: true,
      profileNav: true,
      cats: rows,
      errors: []
    });
  })
  .catch()
}
exports.searchResults = (req, res, next) =>{
  const logedIn = req.session.isLogedIn;
    const keywords = req.query.keywords;
    const category = req.query.category;
    const location = req.query.location;
    // const errors = validationResult(req);
    if(category == 'false' && location.length === 0  && keywords.length > 0) {
      return entitiesMod.searchResultsExceptCat(keywords)
      .then(([rows]) => {
        res.render('main/searchResults', {
          pageTitle: 'Search Results',
          registerNav: true,
          loginNav: true,
          logedIn: logedIn,
          addEntityNav: true,
          dashboardNav: true,
          profileNav: true,
          results: rows,
          reportCon: '',
          reportText : false
        });  
      })
      .catch();
    } else if(category != 'false' && keywords.length > 0 && location.length === 0){
    entitiesMod.catAndKey(keywords, category)
    .then(([rows, fields]) => {
      res.render('main/searchResults', {
        pageTitle: 'Search Results',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,   
        dashboardNav: true,
        profileNav: true,
        results: rows,
        reportText : false
      });
    })
    .catch(err => console.log(err));
  } else if(category != 'false' && location.length > 0 && keywords.length > 0){
    entitiesMod.withLocation(category, location, keywords).then(([rows]) => {
      res.render('main/searchResults', {
        pageTitle: 'Search Results',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,   
        dashboardNav: true,
        profileNav: true,
        results: rows,
        reportText : false
      });
    }).catch(err => console.log(err));
  } else if(category != 'false' && location.length === 0 && keywords.length === 0){
    entitiesMod.onlyCategory(category).then(([rows]) => {
      res.render('main/searchResults', {
        pageTitle: 'Search Results',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,   
        dashboardNav: true,
        profileNav: true,
        results: rows,
        reportText : false
      });
    }).catch(err => console.log(err));
  }
  else if(category != 'false' && location.length > 0 && keywords.length === 0){
    entitiesMod.catAndLoc(category, location).then(([rows]) => {
      res.render('main/searchResults', {
        pageTitle: 'Search Results',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,   
        dashboardNav: true,
        profileNav: true,
        results: rows,
        reportText : false
      });
    }).catch(err => console.log(err));
  } else if(category == 'false' && location.length > 0 && keywords.length > 0) {
    entitiesMod.locAndKey(location, keywords).then(([rows]) => {
      res.render('main/searchResults', {
        pageTitle: 'Search Results',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,   
        dashboardNav: true,
        profileNav: true,
        results: rows,
        reportText : false
      });
    }).catch(err => console.log(err));
  }
  else if(category == 'false' && location.length > 0 && keywords.length == 0) {
    entitiesMod.onlyLoc(location).then(([rows]) => {
      res.render('main/searchResults', {
        pageTitle: 'Search Results',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,   
        dashboardNav: true,
        profileNav: true,
        results: rows,
        reportText : false
      });
    }).catch(err => console.log(err));
  } else {
      return entitiesMod.category()
      .then(([rows]) => {
          res.render('main/main', {
          pageTitle: 'KSE | Welcome',
          registerNav: true,
          loginNav: true,
          logedIn: logedIn,
          addEntityNav: true,
          dashboardNav: true,
          profileNav: true,
          cats: rows,
          errors: 'Search For Something',
          reportText : false
        })    
      })
  }
};  
    
exports.login = (req, res, next) => {
    const logedIn = req.session.isLogedIn;
    res.render('main/login', {
    pageTitle: 'Login To Your Account',
    registerNav: true,
    loginNav: false,
    login: false,
    logedIn  
  })
};
exports.getRegister = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  // const name = req.body.name;
  // const phnNum = req.body.phoneNumber;
  // const pass = req.body.password;
  // const dob = req.body.dob;
  // const profilePic = req.body.profilePicture;
  res.render('main/register', {
    pageTitle: 'Register Your Account',
    registerNav: false,
    loginNav: true,
    login: false,
    logedIn
  })
};
exports.getProfile = (req, res, next) => {
  const profileId = req.params.profileId;
  const logedIn = req.session.isLogedIn;
  userMod.userProfile(profileId)
  .then(([row]) => {
    res.render('admin/profile', {
      pageTitle: 'Profile',
      addEntityNav: true,
      dashboardNav: true,
      profileNav: true,
      registerNav: true,
      loginNav: true,
      logedIn,
      user : row[0],
      edit: false
    });
  })
  .catch(err => console.log(err));
}

