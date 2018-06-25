const mongoose = require('mongoose');

const hikeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  location: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }, 
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

module.exports = mongoose.model('Hike', hikeSchema);

 