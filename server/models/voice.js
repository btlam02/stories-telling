// AudioModel.js
const mongoose = require('mongoose');
const recordingSchema = new mongoose.Schema({
  url: {  
    type: String,
    required: true
  }
});

const audioSchema = new mongoose.Schema({
  voiceId:{
    type: String,
  }, 
  title: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  recordings: [recordingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  private: {  
    type: Boolean,
    default: true
  }
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
