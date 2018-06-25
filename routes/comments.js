const express = require('express');
const Hike = require('../models/hike');
const Comment = require('../models/comment');
const { isLoggedIn, checkCommentOwnership } = require('../middleware/index');
const router = express.Router({ mergeParams: true });

// add new comment
router.post('/', isLoggedIn, function(req, res) {
  Hike.findById(req.params.id)
    // .populate('comments')
    .exec(function(err, hike) {
      if (err) {
        console.error(err);
        res.redirect('/hikes');
      } else {
        Comment.create(req.body.comment, function(err, comment) {
          if (err) {
            req.flash('error', 'Something went wrong.');
            console.log(err);
          } else {
            // add username and id to comments
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment
            comment.save();
            hike.comments.push(comment._id);
            hike.save();
            req.flash('success', 'Successfully added comment');
            res.redirect('/hikes/' + hike._id);
          }
        });
      }
    });
});

// Comments Edit Route
router.get('/:comment_id/edit', checkCommentOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err || !foundCamp) {
      req.flash('error', 'Cannot find that campground');
      return res.redirect('back');
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully updated comment');
        res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
      }
    });
  });
});

// Comments Update Route
router.put('/:comment_id', checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Successfully updated comment');
      res.redirect('/hikes/' + req.params.id);
    }
  });
});

// Destroy Comment Route
router.delete('/:comment_id', checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted.');
      res.redirect('/hikes/' + req.params.id);
    }
  });
});


module.exports = router;