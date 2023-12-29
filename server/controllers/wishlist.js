const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const Story = require('../models/stories');

// Fetch a user's wishlist
const getWishlist = async (req, res) => {
    try {
      let wishlist = await Wishlist.findOne({ user: req.params.userId })
                                   .populate('stories');
      if (!wishlist) {
        return res.status(404).send('Wishlist not found');
      }
      
      wishlist = wishlist.toObject();
      wishlist.stories = wishlist.stories.map(story => {
        if (story.imageUrl) {
          // Đảm bảo rằng imageUrl bắt đầu bằng đường dẫn '/uploads/'
          story.imageUrl = story.imageUrl;
        }
        return story;
      });
  
      res.json(wishlist);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  
// Add a story to a user's wishlist
const addToWishlist = async (req, res) => {
    const userId = req.params.userId;
    const { storyId } = req.body;
  
    try {
      let wishlist = await Wishlist.findOne({ user: userId });
  
      // If the wishlist doesn't exist, create a new one
      if (!wishlist) {
        wishlist = new Wishlist({ user: userId, stories: [storyId] });
        await wishlist.save(); // Save the new wishlist
      } else {
        // If it exists, add the story to the wishlist if it's not already there
        if (!wishlist.stories.includes(storyId)) {
          wishlist.stories.push(storyId);
          await wishlist.save(); // Save the updated wishlist
        }
      }
      wishlist = await Wishlist.findById(wishlist._id).populate('stories');
  
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

const removeFromWishlist = async (req, res) => {
    const userId = req.params.userId;
    const storyId = req.params.storyId;
  
    try {
      // Tìm danh sách yêu thích của người dùng
      const wishlist = await Wishlist.findOne({ user: userId });
  
      // Nếu không tìm thấy danh sách yêu thích hoặc câu chuyện không nằm trong danh sách
      if (!wishlist || !wishlist.stories.includes(storyId)) {
        return res.status(404).json({ message: "Story not found in wishlist or wishlist does not exist." });
      }
  
      wishlist.stories = wishlist.stories.filter(id => id.toString() !== storyId);
      await wishlist.save(); // Lưu danh sách yêu thích sau khi xóa
  
      // Trả về danh sách yêu thích đã được cập nhật
      const updatedWishlist = await Wishlist.findById(wishlist._id).populate('stories');
      res.json(updatedWishlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { getWishlist, addToWishlist ,removeFromWishlist};
