 const express=require('express');
 const router=express.Router();
 const catchAsync=require('../utils/catchAsync');
 const Product = require('../models/product');
const { param, expr } = require('jquery');
const ExpressError = require('../utils/ExpressError');
const { productSchema } = require('../schemas');
const Review=require('../models/review');
const {isLoggedin, isAuthor} = require('../auth');
const products = require('../controllers/products');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(products.index))
    .post(isLoggedin,upload.array('image'),catchAsync(products.createNew));

router.get('/new',isLoggedin,products.getnew);

router.route('/:id')
    .get(catchAsync (products.viewProduct))
    .put(isAuthor,isLoggedin,upload.array('image'),catchAsync (products.putEdit))
    .delete(isAuthor,isLoggedin,catchAsync (products.deleteProduct));

router.get('/:id/edit',isAuthor,isLoggedin,catchAsync (products.getEdit));

module.exports=router;