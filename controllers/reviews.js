const Product = require('../models/product');
const Review =require('../models/review');

module.exports.createReview = async (req,res)=>{
    const product = await Product.findById(req.params.id);
    // const { review.rating,body } = req.body.review;
    // const review = new Review(product);
    // const review = new Review({ rating, body });
    const { rating, body } = req.body;
    const review = new Review({ rating, body });

    console.log("params");
    console.log(req.body);
    console.log("review - controller");

    console.log(review.rating);
    review.author=req.user._id;
    product.reviews.push(review);
    await review.save();
    await product.save();
    req.flash('success','Succesfully submitted the review');
    res.redirect(`/products/${product._id}`);
};

module.exports.deleteReview = async (req,res)=>{
    const { id, rid } = req.params;
    await Product.findByIdAndUpdate(id,{$pull:{reviews:rid}});
    await Review.findByIdAndDelete(rid);
    req.flash('success','Succesfully deleted the review');
    res.redirect(`/products/${id}`);
};