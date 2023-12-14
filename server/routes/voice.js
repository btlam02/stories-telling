

const express = require('express');
const multer = require('multer');
const {addNewAudio, getAllAudios} = require('../controllers/voice'); 

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({ storage: storage });

router.post('/audio/new-audio', upload.array('recording'), async (req, res) => {
    try {
        const { title, userId } = req.body;
        const newAudio = await addNewAudio(title, userId, req.files);
        res.status(201).send({ message: 'Audio added successfully', audio: newAudio });
    } catch (err) {
        res.status(500).send({ message: 'Error adding audio', error: err.message });
    }
});


router.get('/audio/list/', getAllAudios);


module.exports = router;
