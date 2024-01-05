const mongoose = require('mongoose');

const playlistItemSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  voiceId: { type: String } // voiceId như một chuỗi độc lập
});

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [playlistItemSchema] // Sử dụng 'items' để lưu trữ các sự kết hợp storyId và voiceId
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
