const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const Hike = require('../models/hike');
const router = express.Router();

router.get('/', function(req, res){
  res.render('landing');
});


//Auth routes
router.get('/register', function(req, res){
  res.render('auth/register');
});

// handle sign-up
router.post('/register', function(req, res) {
  let newUser = new User({ 
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar || "/images/userIcon.png"
    });

  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('/register', {error: err.message});
    }
    passport.authenticate('local')(req, res, function() {
      //redirect back to campgrounds page
      // req.flash('success', `Welcome to Favehikes ${user.username}`);
      res.redirect('/hikes');
    });
  });
});


// show log-in form
router.get('/login', function(req, res) {
  res.render('auth/login', {page: 'login'});
});

// handle log-in
router.post('/login', passport.authenticate('local', { failureRedirect: './login' }), function(req, res) {
  // req.flash('success', `Welcome back!`);
  res.redirect('/hikes');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/hikes');
})

module.exports = router;