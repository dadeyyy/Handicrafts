const User = require('../models/user');

module.exports.home = (req,res) =>{
    res.render('home')
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        res.redirect('/login');

        // req.login(registeredUser, err => {
        //     if (err) return next(err)
        //     req.flash('success', 'Successfully Registered');
        //     res.redirect('/login');
        // })
    }

    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }

}

module.exports.renderLogin = async (req, res) => { 
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/handicrafts';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye')
        res.redirect('/handicrafts');
    });
}