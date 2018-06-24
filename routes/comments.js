const express = require('express');
const Hike = require('../models/hike');
const Comment = require('../models/comment');
const { isLoggedIn, checkCommentOwnership } = require('../middleware/index');
const router = express.Router({ mergeParams: true });

// Comments Routes
router.get('/new', isLoggedIn, function(req, res){
  Hike.findById(req.params.id, function(err, foundHike){
    if(err){
      console.log('error');
    } else {
      res.render('comments/newComment', {hike: foundHike});
    }
  })
});

router.post('/', isLoggedIn, function(req, res){
  //find hike using ID
  Hike.findById(req.params.id, function(err, hike){
    if(err){
      console.log(err);
      res.redirect('/hikes');
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //connect new comment to hike
          hike.comments.push(comment);
          hike.save();
          //redirect to hike show page
          res.redirect(`/hikes/${hike._id}`);
        }
      });
    }
  });
});

module.exports = router;