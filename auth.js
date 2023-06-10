const Product = require('./models/product');
const Review = require('./models/review');

const { param, expr } = require('jquery');
const ExpressError = require('./utils/ExpressError');
const { productSchema } = require('./schemas');


module.exports.isLoggedin  = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','User is not logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const pr = await Product.findById(id);
    console.log('Product:', pr); // Add this line
    console.log('Author:', pr.author); // Add this line
    if (!req.user||!pr.author || !pr.author.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to access it');
      return res.redirect(`/products`);
    }
    next();
  };
  
  module.exports.isReviewAuthor = async (req, res, next) => {
    const { rid } = req.params;
    const review = await Review.findById(rid);
   
    if (!req.user||!review.author || !review.author.equals(req.user._id)) {
      req.flash('error', 'You are not authorized to access it');
      return res.redirect(`/products`);
    }
    next();
  };
  