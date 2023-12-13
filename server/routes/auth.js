const express = require('express')
const router = express.Router() 
const {signin, signup,test} = require('../controllers/auth')

router.post('/signup',signup);
router.post('/signin', signin);

module.exports = router; 