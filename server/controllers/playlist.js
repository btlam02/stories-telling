const Playlist = require('../models/playlist')


exports.addToPlaylist = async (req, res) => {
    const { userId, storyId } = req.body;
    const playlist = await Playlist.findOne({ userId: userId }) || new Playlist({ userId: userId });
    playlist.stories.push(storyId);
    await playlist.save();
    res.status(200).send('Story added to playlist');
};


exports.getPlaylist = async (req, res) => {
    try {
      const userId = req.params.userId;
      const playlist = await Playlist.findOne({ userId }).populate('stories');
  
      if (!playlist) {
        return res.status(404).send('Playlist not found');
      }
  
      res.json(playlist);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };
  
  


