const express = require('express');
const {addToPlaylist,getPlaylist,removeFromPlaylist,addDefaultVoiceToPlaylist,removeDefaultVoiceFromPlaylist} = require('../controllers/playlist');
const router = express.Router();

router.post('/playlist/add', addToPlaylist);
router.post('/playlist/add-default-voice', addDefaultVoiceToPlaylist);
router.get('/playlist/:userId', getPlaylist);
router.delete('/playlist/:userId/remove/:storyId/:voiceId', removeFromPlaylist);
router.delete('/playlist/:userId/remove-default/:storyId', removeDefaultVoiceFromPlaylist);




module.exports = router;
