// AudioModel.js
const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  url: {  // Lưu trữ URL dẫn đến file âm thanh
    type: String,
    required: true
  }
});

const audioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId cho liên kết với User
    ref: 'User',
    required: true
  },
  recordings: [recordingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  private: {  // Thêm trường private để chỉ định quyền riêng tư của bản ghi âm
    type: Boolean,
    default: true
  }
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
