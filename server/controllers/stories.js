// storyController.js
const Story = require("../models/stories");
const { exec } = require('child_process'); // Cập nhật đường dẫn nếu cần

const addStory = async (req, res) => {
  try {
    const storyData = {
      ...req.body,
      imageUrl: req.file ? req.file.path : undefined, // Lấy đường dẫn ảnh
    };
    let story = new Story(storyData);
    story = await story.save();
    res.status(201).send(story);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// const addStory = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No image file provided');
//     }

//     const storyData = {
//       ...req.body,
//       imageUrl: req.file.path // Lấy đường dẫn ảnh
//     };
//     let story = new Story(storyData);
//     story = await story.save();
//     res.status(201).send(story);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find();
    Story.find().populate("genre").exec();
    res.send(stories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStory = async (req, res) => {
  // Logic lấy một câu chuyện theo ID
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).send("Story not found");
    res.send(story);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateStory = async (req, res) => {
  try {
    const storyUpdate = {
      ...req.body,
    };
    if (req.file) {
      storyUpdate.imageUrl = req.file.path; // Cập nhật ảnh nếu có
    }
    const story = await Story.findByIdAndUpdate(req.params.id, storyUpdate, {
      new: true,
    });
    if (!story) return res.status(404).send("Story not found");
    res.send(story);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const activeStory = async (req, res) => {
  try {
    const { isActive } = req.body;
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { isActive: isActive },
      { new: true }
    );
    res.json(story);
  } catch (error) {
    console.error('Error updating active state:', error);
    res.status(500).send('Server error');
  }
};

const deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).send("Story not found");
    res.send(story);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


const uploadUserAudio = async (req, res) => {
  try {
      const storyId = req.params.storyId;
      const { userId, voiceId } = req.body;
      const audioUrl = req.file.path; 

      const story = await Story.findById(storyId);
      if (!story) {
          return res.status(404).send('Story not found');
      }

      if (story.userId.toString() !== userId) {
        return res.status(403).send('Unauthorized: This story does not belong to the current user');
    }

      let existingVoice = story.userVoices.find(voice => 
          voice.userId.toString() === userId && voice._id.toString() === voiceId
      );

      if (existingVoice) {
          existingVoice.audioUrl = audioUrl;
          existingVoice.status = 'completed';
      } else {
          story.userVoices.push({
              userId,
              voiceId,
              audioUrl,
              status: 'completed',
              // Các trường khác nếu cần
          });
      }
      story.isGenerated = true;
      await story.save();
      res.status(200).send('Audio uploaded and story updated');
  } catch (error) {
      console.error('Error uploading audio:', error);
      res.status(500).send('Internal server error');
  }
};


module.exports = {
  addStory,
  getAllStories,
  getStory,
  updateStory,
  deleteStory,
  activeStory,
  uploadUserAudio,
};


