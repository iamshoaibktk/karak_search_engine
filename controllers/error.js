exports.get404 = (req, res, next) => {
    const logedIn = req.session.logedIn;
    res.render('404', {
        pageTitle: 'Error!',
        registerNav: false,
        loginNav: false,
        login: false,
        logedIn
    });
}