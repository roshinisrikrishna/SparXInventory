const User = require('../models/user');

module.exports.register = (req,res)=>{
    res.render('templates/register')
};

module.exports.postRegister = async (req,res)=>{
    try{
    const {email,username,password}=req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome to SparX');
        res.redirect('/products');
    })
    
    } catch(e) {
    req.flash('error',e.message);
    res.redirect('register');
    }
};
module.exports.getLogin = (req,res)=>{
    res.render('templates/login');
};
module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/products';
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{

    req.logout(function(err){
        if(err)
        {
            return next(err);
        }
        req.flash('success','User is logged out');
        res.redirect('/products');
    });
 
};