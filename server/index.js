const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const https = require('https'); // Import the https module
const fs = require('fs'); // Import fs module to read files
const expressSanitizer = require("express-sanitizer");

// Your routes
const Auth = require('./routes/auth');
const UserRoute = require('./routes/user');
const Voice = require('./routes/voice');
const Genre = require('./routes/genre');
const Stories = require('./routes/stories');
const Wishlist = require('./routes/wishlist');
const Playlist = require('./routes/playlist');

const app = express();

require('dotenv').config();

app.use('/uploads', cors(), express.static('uploads'));

mongoose.connect(process.env.DATABASE).then(() => console.log('DB Connected'));

const options = {
  key: fs.readFileSync("./config/create-ca-key.pem"),
  cert: fs.readFileSync("./config/create-ca.pem"),
};

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

// Define port
const port = process.env.PORT || 8001;

// // Import your SSL files
// app.use("/", express.static("public"));

// Define your routes
app.use('/api',express.static("public"), Auth);
app.use('/api',express.static("public"), UserRoute);
app.use('/api',express.static("public"), Voice);
app.use('/api',express.static("public"),Genre);
app.use('/api',express.static("public"),Stories);
app.use('/api',express.static("public"),Wishlist);
app.use('/api',express.static("public"),Playlist);

app.listen(8001, () => {
  console.log(`Server is running on port 8001`);
});


// //Create an HTTPS server
// https.createServer(options, app).listen(port, () => {
//   console.log(`Server is running on https://localhost:${port}`);
// });

// https.createServer(options, app).listen(8080, () => {
//   console.log(`HTTPS server started on port 8080`, options);
// });