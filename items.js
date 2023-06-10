const mongoose = require('mongoose');

const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/inventory')
    .then(()=>console.log('Connection established!!'))
    .catch(err=>{
        console.log('error occured');
        console.log(err);
    })

const p=new Product({
    name:'Ghee',
    price:150,
    qty:{
        warehouseStock:100,
        shopStock:40
    }
})

const items = [
    {
        name:'Ghee',
    price:150,
    qty:{
        warehouseStock:100,
        shopStock:40
    }
    },
    {
        name:'Rice',
    price:50,
    qty:{
        warehouseStock:500,
        shopStock:70
        }
    },
    {
        name:'Wheat',
    price:75,
    qty:{
        warehouseStock:200,
        shopStock:80
        }
    },
    {
        name:'Sugar',
    price:20,
    qty:{
        warehouseStock:300,
        shopStock:95
        }
    }

    
]

Product.insertMany(items)
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
        console.log('error');
    })

p.save().then(p=>{
    console.log(p)
})
.catch(err=>{
    console.log('error');
    console.log(err);
})