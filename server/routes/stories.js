// storyRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('../controllers/stories');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({ storage: storage });


router.patch('/stories/:id/toggle-active', storyController.activeStory); 
router.post('/create-stories', upload.single('imageUrl'), storyController.addStory);
router.get('/getAll-stories',upload.single('imageUrl'), storyController.getAllStories);
router.get('/get-stories/:id', storyController.getStory);
router.put('/update-stories/:id',upload.single('imageUrl'), storyController.updateStory);
router.delete('/delete-stories/:id', storyController.deleteStory);



module.exports = router;
