const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync');
const Review = require('../models/review');
const Product = require('../models/product');
const ExpressError = require('../utils/ExpressError');
const { productSchema } = require('../schemas');
const {isLoggedin, isReviewAuthor} = require('../auth')
const reviews = require('../controllers/reviews');


router.post('/',isLoggedin,catchAsync(reviews.createReview));
// change the code so that it is deleted by the admin
router.delete('/:rid',isLoggedin,isReviewAuthor,catchAsync(reviews.deleteReview))
module.exports=router;