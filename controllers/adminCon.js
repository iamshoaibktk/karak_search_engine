const usersMod = require("../models/usersMod");
const entitiesMod = require("../models/entitiesMod");
const reportMod = require("../models/reportMod");
const {
  validationResult
} = require("express-validator");
// exports.postDashboard = (req, res, next) => {

// };
exports.getDashboard = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  const userId = req.session.user.id;
  const adminLogedIn = req.session.adminLogedIn;
  let entities;
  let userInfo;
  let allEntities;
  let allUser;
  entitiesMod.fetchUserSpecific(userId)
    .then(([rows]) => {
      entities = rows;
      console.log(rows);
    }).then(() => {
      return usersMod.userProfile(userId).then(([rows]) => {
        userInfo = rows[0];
      }).catch(err => console.log(err))
    }).then(() => {
      return usersMod.countUser().then(([rows]) => {
        allUser = rows[0].total;
      }).catch(err => console.log(err))
    }).then(() => {
      entitiesMod.countEntities().then(([rows]) => {
        allEntities = rows[0].total;
        res.render("admin/dashboard", {
          pageTitle: "Dashboard",
          addEntityNav: true,
          dashboardNav: false,
          profileNav: true,
          results: entities,
          login: true,
          registerNav: false,
          loginNav: false,
          logedIn,
          user: userInfo,
          adminLogedIn,
          allUser: allUser,
          allEntities: allEntities
        });
      }).catch(err => console.log(err))
    })
    .catch(err => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  const fromReport = req.body.fromReport;
  const fromDashboard = req.body.fromDashboard;
  entitiesMod
    .deleteEntity(postId)
    .then(() => {
      if (req.session.adminLogedIn && fromReport == 1) {
        return res.redirect("/admin/reports");
      } else if (req.session.adminLogedIn && fromDashboard == 1) {
        return res.redirect("/admin/dashboard");
      } else if (req.session.adminLogedIn) {
        res.redirect("/admin/allEntities");
      } else res.redirect("/admin/dashboard");
    })
    .catch(err => console.log(err));
};

exports.addEntity = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  res.render("admin/addEntity", {
    pageTitle: "Add Entity",
    addEntityNav: false,
    dashboardNav: true,
    profileNav: true,
    registerNav: false,
    loginNav: false,
    logedIn,
    errors: [],
    oldData: {}
  });
};
exports.addingEntity = (req, res, next) => {
  const user = req.session.user;
  const entityInfo = {
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    address: req.body.address,
    entityPhnNum: req.body.entityPhnNum,
    entityServices: req.body.entityServices,
    EopeningTime: req.body.EopeningTime,
    EclosingTime: req.body.EclosingTime,
    userId: user.id
  };
  const logedIn = req.session.isLogedIn;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/addEntity", {
      pageTitle: "Add Entity",
      addEntityNav: false,
      dashboardNav: true,
      profileNav: true,
      registerNav: false,
      loginNav: false,
      logedIn,
      errors: errors.array()[0],
      oldData: entityInfo
    });
  }
  // if(!req.file) {
  //   return res.render("admin/addEntity", {
  //     pageTitle: "Add Entity",
  //     addEntityNav: false,
  //     dashboardNav: true,
  //     profileNav: true,
  //     registerNav: false,
  //     loginNav: false,
  //     logedIn,
  //     errors: {msg: 'Attach an image(JPG, JPEG, PNG )'},
  //     oldData: entityInfo
  //   }); 
  // }
  if (req.file) {
    entityInfo.entity_img = req.file.path;
  } else entityInfo.entity_img = 'no_image';
  entitiesMod
    .saveEntity(entityInfo)
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch(err => console.log(err));
};

exports.getEditForm = (req, res, next) => {
  let errors = req.flash('errors');
  if (errors.length > 0) {
    errors = errors[0];
  }
  console.log(req.flash('errors'));
  const logedIn = req.session.isLogedIn;
  const postId = req.params.postId;
  entitiesMod
    .fetchSpecific(postId)
    .then(([row]) => {
      res.render("admin/editEntity", {
        results: row[0],
        pageTitle: "Edit Post",
        addEntityNav: true,
        dashboardNav: true,
        profileNav: true,
        registerNav: false,
        loginNav: false,
        logedIn,
        errors
      });
    })
    .catch(err => console.log(err));
};

//Edit post request
exports.editPost = (req, res, next) => {
  const errors = validationResult(req);
  const logedIn = req.session.logedIn;
  console.log(req.body.profilePicture);
  const results = {
    title: req.body.title,
    category: req.body.category,
    entity_desc: req.body.description,
    address: req.body.address,
    entity_phn: req.body.entityPhnNum,
    services: req.body.entityServices,
    opening_time: req.body.EopeningTime,
    closing_time: req.body.EclosingTime,
    postId: req.body.id
  };

  if (!errors.isEmpty()) {
    // req.flash('errors', errors.array()[0]);
    return res.render("admin/editEntity", {
      pageTitle: "Edit Entity",
      addEntityNav: true,
      dashboardNav: true,
      profileNav: true,
      registerNav: false,
      loginNav: false,
      logedIn,
      errors: errors.array()[0],
      results
    }); 
  }
  //  else if(!req.file) {
  //   console.log(req.file);
  //   return res.render("admin/editEntity", {
  //     pageTitle: "Edit Entity",
  //     addEntityNav: true,
  //     dashboardNav: true,
  //     profileNav: true,
  //     registerNav: false,
  //     loginNav: false,
  //     logedIn,
  //     errors: {msg: 'Attach an image(JPG, JPEG, PNG )'},
  //     results
  //   });   
  // }
  if (req.file) {
    results.entity_img = req.file.path;
  } else results.entity_img = 'No Image';
  entitiesMod
    .editEntity(results)
    .then(() => {
      res.redirect("/admin/dashboard");
    })
    .catch(err => console.log(err));

};

exports.profile = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  const user = req.session.user;
  usersMod
    .userProfile(user.id)
    .then(([row]) => {
      res.render("admin/profile", {
        pageTitle: "Add Entity",
        addEntityNav: true,
        dashboardNav: true,
        profileNav: false,
        registerNav: false,
        loginNav: false,
        logedIn,
        user: row[0],
        edit: true
      });
    })
    .catch();
};
exports.getEditProfileForm = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  const userId = req.params.profileId;
  usersMod
    .editUserProfile(userId)
    .then(([row, fields]) => {
      res.render("admin/editProfile", {
        pageTitle: "Edit Your Profile",
        addEntityNav: true,
        dashboardNav: true,
        profileNav: true,
        results: row[0],
        registerNav: false,
        loginNav: false,
        logedIn,
        errors: null
      });
    })
    .catch(err => console.log(err));
};
exports.editProfile = (req, res, next) => {
  const logedIn = req.session.logedIn;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const results = {
      fname: req.body.fname,
      lname: req.body.lname,
      user_phn: req.body.phoneNumber,
      id: req.body.id
    };
    return res.render("admin/editProfile", {
      pageTitle: "Edit Profile",
      addEntityNav: true,
      dashboardNav: true,
      profileNav: true,
      results: results,
      registerNav: false,
      loginNav: false,
      logedIn,
      errors: error.array()[0]
    });
  }
  if (req.file) {
    const profileData = {
      fname: req.body.fname,
      lname: req.body.lname,
      user_phn: req.body.phoneNumber,
      userId: req.body.id,
      profile_img: req.file.path
    };
    usersMod
      .updateProfile(profileData)
      .then(() => {
        res.redirect("/admin/profile");
      })
      .catch(err => console.log(err));
  } else {
    const profileData = {
      fname: req.body.fname,
      lname: req.body.lname,
      user_phn: req.body.phoneNumber,
      userId: req.body.id
    };
    usersMod
      .updateProfileExceptImg(profileData)
      .then(() => {
        res.redirect("/admin/profile");
      })
      .catch(err => console.log(err));
  }
};

exports.allEntities = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  const userId = req.session.user.id;
  const adminLogedIn = req.session.adminLogedIn;
  entitiesMod.fetchAllPostsJoinUser()
    .then(([allPosts]) => {
      usersMod.userProfile(userId).then(([rows]) => {
        console.log(allPosts);
        res.render('admin/allEntities', {
          pageTitle: "Admin || All Posts",
          addEntityNav: false,
          dashboardNav: false,
          profileNav: false,
          results: allPosts,
          login: true,
          registerNav: false,
          loginNav: false,
          logedIn,
          user: rows[0],
          adminLogedIn,
          allUser: '',
          allEntities: ''
        });
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.allUsers = (req, res, next) => {
  const logedIn = req.session.isLogedIn;
  const userId = req.session.user.id;
  const adminLogedIn = req.session.adminLogedIn;
  const error = req.flash('error');
  usersMod.fetchAllUsers()
    .then(([allUsers]) => {
      usersMod.userProfile(userId).then(([rows]) => {
        res.render('admin/allUsers', {
          pageTitle: "Admin || All Users",
          addEntityNav: false,
          dashboardNav: false,
          profileNav: false,
          results: allUsers,
          login: false,
          registerNav: false,
          loginNav: false,
          logedIn,
          user: rows[0],
          adminLogedIn,
          allUser: '',
          allEntities: '',
          error
        });
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  usersMod.userProfile(userId)
    .then(([userData]) => {
      if (userData[0].user_role != 1) {
        return usersMod.deleteUser(userId)
          .then(() => {
            res.redirect('/admin/allUsers');
          })
          .catch(err => console.log(err));
      } else {
        req.flash('error', 'Admin cannot be deleted');
        res.redirect('/admin/allUsers');
      }
    })
    .catch();
}

exports.reportPost = (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.postId;
  const text = req.body.reportText;
  const logedIn = req.session.isLogedIn;
  entitiesMod.checkExistingRepot(userId, postId)
    .then(([reports]) => {
      if (reports.length > 0) {
        return entitiesMod.fetchSpecific(postId)
          .then(([rows]) => {
            res.render('main/searchResults', {
              pageTitle: 'Post report',
              registerNav: true,
              loginNav: true,
              logedIn,
              addEntityNav: true,
              dashboardNav: true,
              profileNav: true,
              results: rows,
              reportedCon: 'Already Reported',
              reportText: true
            });
          })
      } else {
        return entitiesMod.reportPost(userId, postId, text)
          .then(() => {
            return entitiesMod.fetchSpecific(postId)
              .then(([rows]) => {
                res.render('main/searchResults', {
                  pageTitle: 'Post Reported',
                  registerNav: true,
                  loginNav: true,
                  logedIn,
                  addEntityNav: true,
                  dashboardNav: true,
                  profileNav: true,
                  results: rows,
                  reportedCon: 'Post reported to admin',
                  reportText: true
                });
              })
          })
          .catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
}

exports.reports = (req, res, next) => {
  const adminLogedIn = req.session.adminLogedIn;
  const logedIn = req.session.isLogedIn;
  const userId = req.session.user.id;
  usersMod.userProfile(userId)
    .then(([rows]) => {
      return entitiesMod.reports()
        .then(([reports]) => {
          return res.render('admin/reports', {
            pageTitle: "Admin || Reports",
            addEntityNav: false,
            dashboardNav: false,
            profileNav: false,
            results: reports,
            login: false,
            registerNav: false,
            loginNav: false,
            logedIn,
            user: rows[0],
            adminLogedIn,
            allUser: '',
            allEntities: '',
            error: ''
          });
        })
    }).catch(err => console.log(err));
}

exports.viewReportedPost = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.session.user.id;
  const logedIn = req.session.isLogedIn;
  const adminLogedIn = req.session.adminLogedIn;
  console.log(postId);
  usersMod.userProfile(userId).then(([rows]) => {
    return entitiesMod.fetchSpecific(postId).then(([row]) => {
      res.render('admin/reportedPost', {
        pageTitle: 'Reported Post',
        registerNav: true,
        loginNav: true,
        logedIn: logedIn,
        addEntityNav: true,
        dashboardNav: true,
        profileNav: true,
        result: row[0],
        pageTitle: "Admin || Reports",
        user: rows[0],
        adminLogedIn,
        allUser: '',
        allEntities: '',
        error: ''
      })
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}

exports.deleteReport = (req, res,next) => {
  const reportId = req.params.reportId;
  reportMod.deleteReport(reportId)
  .then(() => {
    res.redirect('/admin/reports');
  })
  .catch(err => console.log(err));
} 