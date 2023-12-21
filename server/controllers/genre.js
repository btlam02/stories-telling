const Genre = require('../models/genre');

exports.createGenre = async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).send(genre);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!genre) {
      return res.status(404).send();
    }
    res.send(genre);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res.status(404).send();
    }
    res.send(genre);
  } catch (error) {
    res.status(500).send(error);
  }
};



exports.getAllGenre =  async (req, res) => {
    try {
      const genres = await Genre.find(); // Retrieves all genres
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };