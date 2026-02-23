const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    googleLogin,
    googleAuthUrl,
    googleCallback,
    getMe,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google/login', googleLogin);  // Google Sign-In with ID Token
router.get('/google/url', googleAuthUrl);  // Get Google OAuth URL
router.post('/google/callback', googleCallback);  // Handle OAuth callback
router.get('/me', protect, getMe);

module.exports = router;
