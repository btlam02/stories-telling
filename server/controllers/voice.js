// components/audioComponent.js
const Audio = require('../models/voice'); 


const addNewAudio = async (title, userId,voiceId,files) => {
    const recordings = files.map(file => ({ url: file.path }));
    const newAudio = new Audio({ title, userId, voiceId, recordings });
    await newAudio.save();
    return newAudio;
};


const getAllAudios = async (req, res) => {
    try {
        const audios = await Audio.find({ userId: req.params.userId });
        res.json(audios);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving audios', error: err.message });
    }
};

module.exports = {addNewAudio, getAllAudios}


  