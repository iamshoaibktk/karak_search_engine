const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

const authMod = require('../models/authMod');
const usersMod = require('../models/usersMod');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else message = null;
  
    const logedIn = req.session.isLogedIn;
    res.render('auth/login', {
      pageTitle: 'Login To Your Account',
      registerNav: true,
      loginNav: false,
      logedIn: logedIn,
      addEntityNav: true,
      dashboardNav: false,
      profileNav: true,
      errorMessage: message,
      oldInput: {
        phnNum: '',
        password: ''
      },
      validationErrors: []  
    })
  };
  exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
      message = message[0];
    } else message = null;
    const logedIn = req.session.isLogedIn;
    res.render('auth/register', {
      pageTitle: 'Register Your Account',
      registerNav: false,
      loginNav: true,
      logedIn: logedIn,
      addEntityNav: true,
      dashboardNav: false,
      profileNav: true,
      errorMessage: {msg : message},
      oldInput: { name: "",
        user_phn: "",
        password: "",
        conPassword: "",
        dob: "" },
        validationErrors: []
    });
  };

  exports.postLogin = (req, res, next) => {
    const logedIn = req.session.logedIn;
    let message = req.flash('error');
    if(message.length > 0) message = message[0];
    else message = null;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // console.log(errors.array()[0].msg);
       return res.status(422).render('auth/login', {
        pageTitle: 'Login To Your Account',
        registerNav: true,
        loginNav: false,
        logedIn: logedIn,
        addEntityNav: true,
        dashboardNav: false,
        profileNav: true,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          phnNum: req.body.phnNum,
          password: req.body.password
        },
        validationErrors: errors.array()
       });
    }
    const user_phn = req.body.phnNum;
    const password = req.body.password;
    authMod.validateLogin(user_phn)
    .then(([rows, fields]) => {
      if(!rows[0]) {
        req.flash('error', 'Account with this Phone number not exists.');
        return res.redirect('/login');
      } else if((rows[0])) {
        bcrypt.compare(password, rows[0].password)
        .then(doMatch => {
          if(doMatch && rows[0].user_role === 1){
            req.session.isLogedIn = true;
            req.session.adminLogedIn = true;
            req.session.user = rows[0];
            return req.session.save(err => {
              res.redirect('/admin/dashboard');
            });
          } else if(doMatch && rows[0].user_role === null){
            req.session.isLogedIn = true;
            req.session.user = rows[0];
            return req.session.save(err => {
              res.redirect('/');
            });
          }
          req.flash('error', 'Yout entered Wrong Password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login');
        });
      }
    })
    .catch(err => {
      console.log(err);
    });  
  };

exports.postSignup = (req, res, next) => {
  const logedIn = req.session.logedIn;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).render('auth/register', {
        pageTitle: 'Register Your Account',
        registerNav: false,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,
        dashboardNav: false,
        profileNav: true,
        errorMessage: errors.array()[0],
        oldInput: { fname: req.body.fname,
                    lname: req.body.lname,
                    user_phn: req.body.phoneNumber,
                    password: req.body.password,
                    conPassword: req.body.conPassword,
                    dob: req.body.dob },
        validationErrors: errors.array()            
        });
    }
    if(!req.file) {
      return res.status(422).render('auth/register', {
        pageTitle: 'Register Your Account',
        registerNav: false,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,
        dashboardNav: false,
        profileNav: true,
        errorMessage: {msg: 'Attach an image(JPG, JPEG, PNG )'},
        oldInput: { fname: req.body.fname,
                    lname: req.body.lname,
                    user_phn: req.body.phoneNumber,
                    dob: req.body.dob,
                    password: req.body.password, 
                    conPassword: req.body.conPassword },
        validationErrors: []            
        });
    }
    authMod.checkExisting(req.body.phoneNumber)
    .then(([rows, fields]) => {  
      if(rows[0]){
        req.flash('error', 'Phone Number Exists Already, please pick a different one.');
        return res.redirect('/signup');
      }
      return bcrypt.hash(req.body.password, 12)
      .then(hashPass => {
        const userData = {
        fname :req.body.fname,
        lname: req.body.lname, 
        user_phn: req.body.phoneNumber, 
        password: hashPass, 
        dob: req.body.dob, 
        profile_img: req.file.path
        }
          return usersMod.save(userData).then(() => {
            return req.body.phoneNumber;
          })
      }).then((phnNum) => {
          authMod.checkExisting(phnNum)
          .then(([row, fields]) => {
            req.session.isLogedIn = true;
            req.session.user = row[0];
            return req.session.save(err => {
              console.log(err);
            });
          })
          .catch(err => console.log(err));
          res.redirect('/');
        })
    }).catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
    });
}

   