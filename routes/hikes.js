const express = require('express');
const router = express.Router();
const {isLoggedIn, checkHikeOwnership} = require('../middleware/index');
const Hike = require('../models/hike');

// GET all hikes Route
router.get('/', function(req, res){
  let perPage = 8;
  let pageQuery = parseInt(req.query.page);
  let pageNumber = pageQuery ? pageQuery : 1;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // get hikes by search parameters
  Hike.find({name: regex})
  .skip(perPage * pageNumber - perPage)
  .limit(perPage)
  .exec(function(err, allHikes){
    if(err){
      req.flash('error', 'Internal server error');
      console.log('error getting hikes');
    } else {
      if (allHikes.length < 1) {
            req.flash('error', 'No hikes found. Please try again.');
            res.redirect('/hikes');
    } else {
        Hike.count().exec(function(err, count) {
              if (err) {
                console.log(err);
                req.flash('error', 'Internal server error');
                res.redirect('/hikes');
              } else {
                res.render('hikes/index', {
                  hikes: allHikes,
                  page: 'hikes',
                  current: pageNumber,
                  pages: Math.ceil(count / perPage)
                });
              }
            });
          }
        }
      });
  } else {
    //get all hikes from the DB
    Hike.find({})
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function(err, allHikes) {
        Hike.count().exec(function(err, count) {
          if (err) {
            console.log('error happened', err);
          } else {
            res.render('hikes/index', {
              hikes: allHikes,
              page: 'hikes',
              current: pageNumber,
              pages: Math.ceil(count / perPage)
            });
          }
        });
      });
  }
});
 
//Show form to create new hike Route
router.get('/new', isLoggedIn, function(req, res){
  res.render('hikes/new');
});

//Post new hike Route 
router.post('/', isLoggedIn, function(req, res){
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let location = req.body.location;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newHike = {
    name, 
    image,
    description,
    location,
    author
    };

  Hike.create(newHike, function(err, newHike){
    if(err){
      console.log('error creating new hike');
    } else{
      res.redirect('/hikes');
    }
  })
});

// GET Route to show specific hike
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

// Edit specific hike
router.get('/:id/edit', checkHikeOwnership, function(req, res) {
  Hike.findById(req.params.id, function(err, foundHike) {
    res.render('hikes/edit', { hike: foundHike });
  });
});

// Update specific hike
router.put('/:id', checkHikeOwnership, function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let location = req.body.location;
  let author = {
    id: req.user._id,
    username: req.user.username
  };

  let updatedHike = {
      name, 
      image,
      description,
      location,
      author
    };

  // find and update the correct hike
  Hike.findByIdAndUpdate(req.params.id, { $set: updatedHike }, function(err, updatedHike) {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully updated.');
        res.redirect(`/hikes/${req.params.id}`);
      }
    });
});

// Delete hike
router.delete('/:id', checkHikeOwnership, function(req, res) {
  Hike.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/hikes');
    } else {
      req.flash('success', 'Successfully deleted.');
      res.redirect('/hikes');
    }
  });
});


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;