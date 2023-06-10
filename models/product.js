const mongoose =require('mongoose');
const Review =require('./review');
const productSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    price:{
        type:Number,
        required: true,
        min: 0
    },
    image:[{
        url:String,
        filename:String
    }],
    qty:{
              
        warehouseStock :{
            type: Number,
            required:true

        },
        shopStock:{
            type: Number,
            required:true
            
        },
        
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]

});

productSchema.post('findOneAndDelete',async function(pr){
    if(pr){
        await Review.deleteMany({
            _id:{
                $in : pr.reviews
            }
        })
    }
})

const Product = new mongoose.model('Product',productSchema);
module.exports = Product;