require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {CLIENT_ORIGIN, PORT, DATABASE_URL, TESTING, SECRET} = require('./config');
const flash = require('connect-flash');
const commentRoutes = require('./routes/comments');
const hikeRoutes = require('./routes/hikes');
const indexRoutes = require('./routes/index');
const methodOverride = require('method-override');

app.locals.moment = require('moment');
mongoose.Promise = global.Promise;

//Passport config
app.use(require('express-session')({
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');
app.use( cors({ origin: CLIENT_ORIGIN }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

// show messages to user
app.use(flash());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})

app.use('/hikes', hikeRoutes);
app.use('/hikes/:id/comments', commentRoutes);
app.use(indexRoutes);


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