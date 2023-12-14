// components/audioComponent.js

const Audio = require('../models/voice'); // Update the path as needed

const addNewAudio = async (title, userId, files) => {
    const recordings = files.map(file => ({ url: file.path }));
    const newAudio = new Audio({ title, userId, recordings });
    await newAudio.save();
    return newAudio;
};

const getAllAudios= async (req, res) => {
    try {
        const userId = req.query.userId;

        // Validate userId
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        // Fetch audios for the given user
        const audios = await Audio.find({ userId: userId });

        res.json(audios);
    } catch (error) {
        console.error("Error fetching audios: ", error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports = {addNewAudio, getAllAudios}


  