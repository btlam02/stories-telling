const mongoose = require('mongoose');

const playlistItemSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  voiceId: { type: String } ,
  isDefaultVoiceAdded:{type: Boolean, default: false}, 
});

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [playlistItemSchema] 
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;



