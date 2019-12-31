exports.isLogedIn = (req, res, next) => {
    if(!req.session.isLogedIn) {
        return res.redirect('/login');
    }
    next();
}
exports.adminIsLogedIn = (req, res, next) => {
    if(!req.session.adminLogedIn) {
        return res.redirect('/admin/dashboard');
    }
    next();
}