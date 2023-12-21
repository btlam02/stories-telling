const express = require('express');
const genreController = require('../controllers/genre');

const router = express.Router();

router.get('/getAll-genre', genreController.getAllGenre);

router.post('/new-genre', genreController.createGenre);

router.put('/change-genre/:id', genreController.updateGenre);

router.delete('/delete-genre/:id', genreController.deleteGenre);

module.exports = router;
