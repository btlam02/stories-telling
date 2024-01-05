const Playlist = require("../models/playlist");
const Audio = require("../models/voice")
const mongoose = require("mongoose");

exports.addToPlaylist = async (req, res) => {
  const { storyId, voiceId, userId} = req.body;
  try {
    let playlist = await Playlist.findOne({ userId });

    if (!playlist) {
      playlist = new Playlist({ userId, items: [] });
    }
  

    // Kiểm tra xem sự kết hợp storyId và voiceId đã tồn tại hay chưa
    const existingItem = playlist.items.find(item => item.storyId.equals(storyId) && item.voiceId === voiceId);

    if (!existingItem) {
      playlist.items.push({ storyId, voiceId });
      await playlist.save();
      res.status(200).send('Story and voice added to the playlist');
    } else {
      res.status(400).send('This story and voice combination already exists in the playlist');
    }
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};


exports.addDefaultVoiceToPlaylist = async (req, res) => {
  const { storyId, userId } = req.body;

  try {
    let playlist = await Playlist.findOne({ userId });

    if (!playlist) {
      playlist = new Playlist({ userId, items: [] });
    }

    // Kiểm tra xem story với giọng đọc mặc định đã tồn tại chưa
    const existingItem = playlist.items.find(item => item.storyId.equals(storyId) && item.isDefaultVoiceAdded);

    if (!existingItem) {
      playlist.items.push({ storyId, isDefaultVoiceAdded: true });
      await playlist.save();
      res.status(200).send('Default voice added to the playlist');
    } else {
      res.status(400).send('This story with default voice already exists in the playlist');
    }
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};



// exports.getPlaylist = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const playlist = await Playlist.findOne({ userId }).populate('items.storyId');

//     if (!playlist) {
//       return res.status(404).send('Playlist not found');
//     }

//     // Since we cannot use populate for voiceId, we fetch the details manually
//     const audioDetailsPromises = playlist.items.map(item =>
//       Audio.findOne({ voiceId: item.voiceId }).exec() // Assuming voiceId is unique in Audio
//     );

//     const audioDetails = await Promise.all(audioDetailsPromises);

//     const playlistItems = playlist.items.map((item, index) => {
//       const audioInfo = audioDetails[index]; // This holds the fetched Audio document
//       return {
//         storyId: item.storyId._id,
//         storyTitle: item.storyId.title,
//         voiceId: item.voiceId,
//         voiceTitle: audioInfo ? audioInfo.title : 'Unknown', // Fallback if Audio not found
//         // ... other details you might want to include
//       };
//     });

//     res.status(200).json({ playlist: playlistItems });
//   } catch (error) {
//     console.error('Error fetching playlist:', error);
//     res.status(500).send('Server error');
//   }
// };

exports.getPlaylist = async (req, res) => {
  const { userId } = req.params;

  try {
    const playlist = await Playlist.findOne({ userId }).populate('items.storyId');

    if (!playlist) {
      return res.status(404).send('Playlist not found');
    }

    const playlistItems = await Promise.all(playlist.items.map(async (item) => {
      if (item.isDefaultVoiceAdded==true) {
        // Nếu là giọng đọc mặc định
        return {
          storyId: item.storyId._id,
          storyTitle: item.storyId.title,
          voiceId: "",
          voiceTitle: 'Default' // Gán giọng đọc mặc định
        };
      } else {
        // Xử lý cho giọng đọc cụ thể
        const audioInfo = await Audio.findOne({ voiceId: item.voiceId }).exec();
        return {
          storyId: item.storyId._id,
          storyTitle: item.storyId.title,
          voiceId: item.voiceId,
          voiceTitle: audioInfo ? audioInfo.title : 'Unknown' // Fallback if Audio not found
          // ... other details you might want to include
        };
      }
    }));

    res.status(200).json({ playlist: playlistItems });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).send('Server error');
  }
};


// Xử lý xoá giọng đọc mặc định
exports.removeDefaultVoiceFromPlaylist = async (req, res) => {
  const { userId, storyId } = req.params;

  try {
    const playlist = await Playlist.findOne({ userId });
    if (playlist) {
      // Xoá mục có isDefaultVoice
      playlist.items = playlist.items.filter(item => !(item.storyId.equals(storyId) && item.isDefaultVoiceAdded));
      await playlist.save();
      res.status(200).send('Default voice removed from playlist');
    } else {
      res.status(404).send('Playlist not found');
    }
  } catch (error) {
    console.error('Error removing default voice from playlist:', error);
    res.status(500).send('Server error');
  }
};



exports.removeFromPlaylist = async (req, res) => {
  const { userId, storyId, voiceId } = req.params; // Use params instead of body

  try {
    const playlist = await Playlist.findOne({ userId });

    if (!playlist) {
      return res.status(404).send('Playlist not found');
    }

    // Filter out the item that matches both the storyId and the voiceId
    playlist.items = playlist.items.filter(item => !(item.storyId.equals(storyId) && item.voiceId === voiceId));

    await playlist.save();
    res.status(200).send('Removed from the playlist');
  } catch (error) {
    console.error('Error removing from playlist:', error);
    res.status(500).send('Server error');
  }
};



