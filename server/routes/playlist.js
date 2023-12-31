const express = require('express');
const {addToPlaylist,getPlaylist} = require('../controllers/playlist');
const router = express.Router();

router.post('/playlist/add', addToPlaylist);
router.get('/playlist/:userId', getPlaylist);


module.exports = router;
