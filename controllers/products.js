const { cloudinary } = require('../cloudinary');
const Product = require('../models/product');


module.exports.index = async (req,res)=>{
    const products = await Product.find({});
    res.render('templates/list',{products});
}
module.exports.getnew = (req,res)=>{
    res.render('templates/addProduct');
};

module.exports.createNew = async (req,res)=>{
    // const {error} = productSchema.validate(req.body);
    // if(error){
    //     const msg = error.details.map(el=>el.message).join(',')
    //     throw new ExpressError(msg,400);
    // }
    // // console.log(result);
    const newproduct = new Product(req.body);
    newproduct.image = req.files.map(f=>({url:f.path,filename:f.filename}));
    newproduct.author = req.user._id;
    await newproduct.save();
    req.flash('success','Successfully created a Product!!!');
    res.redirect('/products');
   
};

module.exports.viewProduct = async(req,res)=>{
    
    const product=await Product.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}});
    if(!product){
        req.flash('error','Couldnt find the product');
        return res.redirect('/products');
    }
    res.render('templates/detail',{product});
};

module.exports.getEdit= async (req,res)=>{
    const {id} = req.params;
    const product =await Product.findById(id);
    
    if(!product){
        req.flash('error','Couldnt find the product');
        return res.redirect('/products');
    }
    res.render('templates/edit',{product});

};
module.exports.putEdit = async (req,res)=>{
    const {id} = req.params;
    
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});
    // const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}));

    product.image.push(...imgs);
    await product.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({$pull:{image:{filename: {$in:req.body.deleteImages}}}});
    }

    req.flash('success','Successfully updated the product!');
    res.redirect(`/products/${product._id}`);
};
module.exports.deleteProduct = async (req,res)=>{
    const {id} = req.params;
    
    await Product.findByIdAndDelete(id);
    req.flash('success','Succesfully deleted the product');

    res.redirect('/products');
};