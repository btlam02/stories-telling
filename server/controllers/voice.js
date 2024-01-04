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

const deleteAudio = async (req, res) => {
    try {
        const voiceId= req.params.audioId;
        const audio = await Audio.findByIdAndDelete(voiceId);

        if (!audio) {
            return res.status(404).send({ message: 'Audio not found' });
        }

        res.send({ message: 'Audio deleted successfully!' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting audio', error: err.message });
    }
};



module.exports = {addNewAudio, getAllAudios, deleteAudio}


  