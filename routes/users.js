const express=require('express');
const router=express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../auth');
const users = require('../controllers/users')

router.route('/register')
    .get(users.register)
    .post(catchAsync(users.postRegister));
router.route('/login')
    .get(users.getLogin)
    .post(storeReturnTo ,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.postLogin);


router.get('/logout',users.logout);

module.exports = router;