const express = require('express')
const router = express.Router() 
const {signin, signup, forgotPassword, resetPassword } = require('../controllers/auth')

router.post('/signup',signup);
router.post('/signin', signin);

router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword);


module.exports = router;    