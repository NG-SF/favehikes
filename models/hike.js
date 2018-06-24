const mongoose = require('mongoose');

const hikeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

module.exports = mongoose.model('Hike', hikeSchema);

 