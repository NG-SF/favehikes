const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {CLIENT_ORIGIN, PORT, DATABASE_URL, TESTING} = require('./config');

app.set('view engine', 'ejs');
app.use( cors({ origin: CLIENT_ORIGIN }));
app.use(bodyParser.urlencoded({extended: true}));

const hikeSchema = new mongoose.Schema({
  name: String,
  image: String
});

const Hike = mongoose.model('Hike', hikeSchema);


let data = [
  {name: 'hike 1', image: 'https://cdn.pixabay.com/photo/2014/05/03/00/42/vw-camper-336606_960_720.jpg'},
  {name: 'hike 2', image: 'https://image.shutterstock.com/z/stock-photo-family-vacation-travel-rv-holiday-trip-in-motorhome-caravan-car-vacation-beautiful-nature-norway-1017257911.jpg'},
  {name: 'hike 3', image: 'https://image.shutterstock.com/z/stock-photo-landscape-and-clouds-293246735.jpg'},
  {name: 'hike 2', image: 'https://image.shutterstock.com/z/stock-photo-family-vacation-travel-rv-holiday-trip-in-motorhome-caravan-car-vacation-beautiful-nature-norway-1017257911.jpg'},
  {name: 'hike 3', image: 'https://image.shutterstock.com/z/stock-photo-landscape-and-clouds-293246735.jpg'}
  ];

app.get('/', function(req, res){
  res.render('landing');
});

app.get('/hikes', function(req, res){
  Hike.find({}, function(err, allHikes){
    if(err){
      console.log('error getting hikes');
    } else {
      res.render('hikes', {hikes: allHikes});
    }
  })
})

app.get('/hikes/new', function(req, res){
  res.render('new.ejs');
});

app.post('/hikes', function(req, res){
  let name = req.body.name;
  let image = req.body.image;
  let newHike = {name, image};
  Hike.create(newHike, function(err, newHike){
    if(err){
      console.log('error creating new hike');
    } else{
      res.redirect('/hikes');
    }
  })
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