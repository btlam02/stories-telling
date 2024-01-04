const Playlist = require("../models/playlist");

exports.addToPlaylist = async (req, res) => {
  const { userId, storyId } = req.body;
  console.log("Finding playlist for userId:", userId);
  const playlist =
    (await Playlist.findOne({ userId: userId })) ||
    new Playlist({ userId: userId });
  console.log("Found or created playlist:", playlist);

  playlist.stories.push(storyId);
  await playlist.save();
  res.status(200).send("Story added to playlist");
};

exports.removePlaylist = async(req, res) =>{

}

exports.getPlaylist = async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlist = await Playlist.findOne({ userId }).populate("stories");

    if (!playlist) {
      return res.status(404).send("Playlist not found");
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).send("Server error");
  }
};


exports.removeFromPlaylist = async (req, res) => {
  const { userId, storyId } = req.params;

  try {
    const playlist = await Playlist.findOne({ userId });

    // Check if the playlist exists and contains the story
    if (!playlist || !playlist.stories.includes(storyId)) {
      return res.status(404).send("Story not found in playlist or playlist does not exist.");
    }

    // Filter out the storyId from the playlist
    playlist.stories = playlist.stories.filter(id => id.toString() !== storyId);
    await playlist.save();

    // Optionally, populate the stories if you need detailed information
    const updatedPlaylist = await Playlist.findById(playlist._id).populate('stories');
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
