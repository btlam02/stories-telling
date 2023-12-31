const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const Schema = mongoose.Schema;

const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    stories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
    }],
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist