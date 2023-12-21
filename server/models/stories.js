const mongoose = require("mongoose");



// Giọng đọc 
const voiceSchema = new mongoose.Schema({
  narrator: String, // Đây là chổ để lưu role giọng đọc là của ai ! 
  audioUrl: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return !this.isDefault;
    },
  },
});


const storySchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  imageUrl: {
    type:String,
  },
  isActive: {
    type: Boolean,
    default: false, 
  },
  defaultVoice:[voiceSchema],
  userVoices: [voiceSchema],
});



const Story = mongoose.model("Story", storySchema);

module.exports = Story;
