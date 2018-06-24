const Comment = require('../models/comment');
const Hike = require('../models/hike');
const middleware = {};

middleware.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
};

middleware.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        // check if user owns the comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that.");
          res.redirect('back');
        }
      }
    });
  } else {
    // if not logged-in, redirect
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middleware.checkHikeOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Hike.findById(req.params.id, function(err, foundHike) {
      if (err || !foundHike) {
        req.flash('error', 'Hike not found.');
        res.redirect('back');
      } else {
        // check if user owns the campground
        if (foundHike.author.id.equals(req.user._id)) {
          next();
        } else {
          // if not redirect user back and display message
          req.flash('error', "You don't have permission to do that.");
          res.redirect('back');
        }
      }
    });
  } else {
    // if not, redirect
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

module.exports = middleware;
