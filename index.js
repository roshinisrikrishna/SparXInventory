if(process.env.NODE_ENV!=="production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ejsMate = require('ejs-mate');
const mongoSanitize=require('express-mongo-sanitize');

const Product = require('./models/product');
const { param, expr } = require('jquery');
const ExpressError = require('./utils/ExpressError');
const { productSchema } = require('./schemas');
const products = require('./routes/products');
const Review=require('./models/review');
const reviews=require('./routes/reviews');
const User = require('./models/user');
const users = require('./routes/users');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/inventory';
// mongodb://127.0.0.1:27017/inventory
mongoose.connect(dbUrl)
    .then(() => console.log('Connection established!!'))
    .catch(err => {
        console.log('error occurred');
        console.log(err);
    });


    
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const secret = process.env.SECRET || 'thisisasecret';

const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:24*60*60,
    crypto : {
        secret
    }
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})
const sessionConfig = {
    store,
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
})
app.use('/',users);

app.use('/products', products);
app.use('/products/:id/review',reviews);
app.get('/',(req,res)=>{
    res.render('home')
})


app.use((err, req, res, next) => {
    const { statusCode = 404, message = 'Something went wrong' } = err;
    res.status(statusCode);
    console.log(err);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("server opened");
});
