const express = require('express');
const router = express.Router();
const {isLoggedIn, checkHikeOwnership} = require('../middleware/index');
const Comment = require('../models/comment');
const Hike = require('../models/hike');

// GET all hikes Route
router.get('/', function(req, res){
  Hike.find({}, function(err, allHikes){
    if(err){
      console.log('error getting hikes');
      req.flash('error', 'No hikes found. Please try again');
    } else {
      res.render('hikes/index', {hikes: allHikes});
    }
  })
})

//Show form to create new hike Route
router.get('/new', function(req, res){
  res.render('hikes/new');
});

//Post new hike Route 
router.post('/', function(req, res){
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newHike = {
    name, 
    image,
    description
    };
  Hike.create(newHike, function(err, newHike){
    if(err){
      console.log('error creating new hike');
    } else{
      res.redirect('/hikes');
    }
  })
});

// GET Route to show info about hike
router.get('/:id', function(req, res){
  Hike.findById(req.params.id).populate('comments').exec(function(err, foundHike){
    if(err || !foundHike){
      req.flash('error', 'Hike not found');
      res.redirect('back');
    } else {
      res.render('hikes/show', {hike: foundHike});
    }
  });

});

module.exports = router;