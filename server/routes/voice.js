const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { addNewAudio, getAllAudios, deleteAudio,getVoicebyVoiceId } = require("../controllers/voice");
require('dotenv').config();

const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { title, userId, voiceId } = req.body;
    const userVoiceDir = `uploads/voices/${title}-${userId}-${voiceId}`;

    if (!fs.existsSync(userVoiceDir)) {
      fs.mkdirSync(userVoiceDir, { recursive: true });
    }

    cb(null, userVoiceDir);
  },
  filename: function (req, file, cb) {
    const { title, userId, voiceId } = req.body;
    const originalname = file.originalname;
    const audioFilePath = `${title}-${userId}-${voiceId}-${originalname}`;
    
    // Kiểm tra xem tệp có phải là định dạng .wav không
    if (path.extname(originalname).toLowerCase() === '.wav') {
      cb(null, originalname);
    } else {
      cb(new Error('Only .wav files are allowed'));
    }
  },
});

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/audios'); // Thư mục lưu file âm thanh đã generated
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});


const upload = multer({ storage: storage });
const audioUpload = multer({ storage: audioStorage });


router.post("/audio/new-audio", upload.array("recording"), async (req, res) => {
    try {
        const { title, userId, voiceId } = req.body;
        const newAudio = await addNewAudio(title, userId, voiceId, req.files);
        const audioFilePath = `uploads/voices/${title}-${userId}-${voiceId}-${req.files[0].originalname}`;
        res
          .status(201)
          .send({ message: "Audio added successfully", audio: newAudio });
      } catch (err) {
        res.status(500).send({ message: "Error adding audio", error: err.message });
      }
});

const { v4: uuidv4 } = require("uuid");

router.post("/voice/generate-id", (req, res) => {
  try {
    const voiceId = uuidv4();
    res.json({ voiceId });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error generating voiceId", error: err.message });
  }
});

router.get("/audio/list/:userId", getAllAudios);
router.get("/audio/:audioId",getVoicebyVoiceId); 
router.delete("/audio/:audioId",deleteAudio); 


module.exports = router;
 