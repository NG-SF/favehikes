const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Hike = require('./models/hike');
const Comment = require('./models/comment');
const {CLIENT_ORIGIN, PORT, DATABASE_URL, TESTING} = require('./config');
const seedDB = require('./seed');

seedDB();
app.set('view engine', 'ejs');
app.use( cors({ origin: CLIENT_ORIGIN }));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.render('landing');
});

// GET all hikes Route
app.get('/hikes', function(req, res){
  Hike.find({}, function(err, allHikes){
    if(err){
      console.log('error getting hikes');
    } else {
      res.render('hikes/index', {hikes: allHikes});
    }
  })
})

//Show form to create new hike Route
app.get('/hikes/new', function(req, res){
  res.render('hikes/new');
});

//Post new hike Route 
app.post('/hikes', function(req, res){
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
app.get('/hikes/:id', function(req, res){
  Hike.findById(req.params.id).populate('comments').exec(function(err, foundHike){
    if(err){
      console.log('cannot find');
    } else {
      res.render('hikes/show', {hike: foundHike});
    }
  });

});

// Comments Routes
app.get('/hikes/:id/comments/new', function(req, res){
  Hike.findById(req.params.id, function(err, foundHike){
    if(err){
      console.log('error');
    } else {
      res.render('comments/newComment', {hike: foundHike});
    }
  })
});

app.post('/hikes/:id/comments', function(req, res){
  //find hike using ID
  Hike.findById(req.params.id, function(err, hike){
    if(err){
      console.log(err);
      res.redirect('/hikes');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          hike.comments.push(comment);
          hike.save();
          res.redirect(`/hikes/${hike._id}`);
        }
      });
    }
  });
  //create new comment

  //connect new comment to hike

  //redirect to hike show page
});

// this function starts the server.
// it is also used in integration tests.
function runServer(databaseUrl = DATABASE_URL, port = PORT, testing=false) {
  // TESTING = testing; 
  testing = TESTING;
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        console.log('Error from mongoose.connect');
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
// this function closes the server, and returns a promise.
// it is also used in integration tests.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly, this block
// runs. Export runServer command for testing
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };