const express = require('express');
const wishlistController = require('../controllers/wishlist');

const router = express.Router();

router.get('/wishlist/:userId', wishlistController.getWishlist); 
router.post('/wishlist/:userId/add',wishlistController.addToWishlist); 
router.delete('/wishlist/:userId/remove/:storyId', wishlistController.removeFromWishlist);



module.exports = router;