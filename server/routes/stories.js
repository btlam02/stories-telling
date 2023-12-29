// storyRoutes.js
const express = require('express');
const fs = require("fs");
const path = require("path");
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


const audiosStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const storyId = req.params.storyId; // Lấy storyId từ params
        const { userId, voiceId } = req.body;
        const userVoiceDir = `uploads/audios/${storyId}/${userId}/${voiceId}`;

        if (!fs.existsSync(userVoiceDir)) {
            fs.mkdirSync(userVoiceDir, { recursive: true });
        }

        cb(null, userVoiceDir);
    },
    filename: function (req, file, cb) {
        const storyId = req.params.storyId; // Lấy storyId từ params
        const { userId, voiceId } = req.body;
        const originalname = file.originalname;
        const audioFileName = `${storyId}-${userId}-${voiceId}-${Date.now()}${path.extname(originalname)}`;

        cb(null, audioFileName);
    },
});


const upload = multer({ storage: storage });
const audiosUpload = multer({ storage: audiosStorage });


router.patch('/stories/:id/toggle-active', storyController.activeStory); 
router.post('/create-stories', upload.single('imageUrl'), storyController.addStory);
router.get('/getAll-stories',upload.single('imageUrl'), storyController.getAllStories);
router.get('/get-stories/:id', storyController.getStory);
router.put('/update-stories/:id',upload.single('imageUrl'), storyController.updateStory);
router.delete('/delete-stories/:id', storyController.deleteStory);
router.post('/stories/:storyId/upload-audio', audiosUpload.single('audioFile'), storyController.uploadUserAudio);



module.exports = router;
