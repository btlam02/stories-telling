const fs = require("fs");
const { google } = require('googleapis');

const express = require("express");
const multer = require("multer");
const { addNewAudio, getAllAudios } = require("../controllers/voice");

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
    cb(null, file.originalname); // Sử dụng tên file gốc
  },
});

const CLIENT_ID = '517307523680-7f92ufjhf26voa02mavckad4p6jjkhuf.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground/'

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Đường dẫn đến tệp token.json để lưu trữ mã thông báo truy cập
const TOKEN_PATH = 'token.json';

// Phương thức này sẽ xác thực và lấy mã thông báo truy cập
async function authenticate() {
  try {
    // Đọc tệp token (nếu đã được tạo trước đó)
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
  } catch (error) {
    // Nếu không có token, thì sẽ tạo mới
    await getAccessToken();
  }
}

async function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });

  console.log("Authorize this app by visiting this URL:", authUrl);

  const code = "paste_the_code_here"; // Bạn cần lấy mã code từ URL sau khi xác thực

  const token = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(token);

  // Lưu token vào tệp token.json để sử dụng lần sau
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
}

// Phương thức này sẽ tải tệp âm thanh lên Google Drive
async function uploadAudioToDrive() {
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  const fileMetadata = {
    name: audioFilePath.split("/").pop(), 
  };


  const media = {
    mimeType: "audio/mp3",
    body: fs.createReadStream(audioFilePath),// Thay thế bằng đường dẫn thực sự
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    console.log("File ID:", response.data.id);
  } catch (err) {
    console.error("Error uploading file to Google Drive:", err.message);
  }
}

const upload = multer({ storage: storage });

router.post("/audio/new-audio", upload.array("recording"), async (req, res) => {
    try {
        const { title, userId, voiceId } = req.body;
        const newAudio = await addNewAudio(title, userId, voiceId, req.files);
        const audioFilePath = `uploads/voices/${title}-${userId}-${voiceId}-${req.files[0].filename}`;
        await uploadAudioToDrive(audioFilePath);
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

async function main() {
  try {
    await authenticate();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();

module.exports = router;
