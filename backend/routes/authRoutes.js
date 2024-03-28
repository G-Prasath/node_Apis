const express = require('express');
const router = express.Router();

const { register, login, resetPassword, verifyOtp, logout } = require('../controllers/authController.js');
const { verifyToken } = require('../services/authService.js');

router.post('/register', register);

router.post('/login', login);

router.post('/reset-password', resetPassword);

router.post('/verify/:otp', verifyOtp);

router.get('/logout', logout);

router.get('/data', verifyToken, (req, res) => {
    res.json({message: `Welcome to ${req.user.email}`})
});





router.get('/about', (req, res) => {
    res.send(`<h1>This Home Page</h1>`)
})


module.exports = router;
