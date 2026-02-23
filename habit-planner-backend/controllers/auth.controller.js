const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Initialize Google OAuth2 Client
const getGoogleClient = () => {
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is set in authMiddleware -> we need to implement that next
    res.status(200).json(req.user);
});

// @desc    Google Sign-In with ID Token
// @route   POST /api/auth/google/login
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;
    
    if (!credential) {
        res.status(400);
        throw new Error('Google credential is required');
    }

    const client = getGoogleClient();

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        // Create new user
        user = await User.create({
            name: name || email.split('@')[0],
            email,
            googleId,
            avatar: picture,
            authProvider: 'google',
        });
    } else if (!user.googleId) {
        // Update existing user with Google ID
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        user.authProvider = 'google';
        await user.save();
    }

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        token: generateToken(user._id),
    });
});

// @desc    Google OAuth - Generate Auth URL (for redirect flow)
// @route   GET /api/auth/google/url
// @access  Public
const googleAuthUrl = asyncHandler(async (req, res) => {
    const client = getGoogleClient();

    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'openid',
        ],
        prompt: 'consent',
    });

    res.json({ url: authUrl });
});

// @desc    Google OAuth - Handle Callback (for redirect flow)
// @route   POST /api/auth/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const client = getGoogleClient();

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    
    // Get user info from Google
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        // Create new user
        user = await User.create({
            name: name || email.split('@')[0],
            email,
            googleId,
            avatar: picture,
            authProvider: 'google',
        });
    } else if (!user.googleId) {
        // Update existing user with Google ID
        user.googleId = googleId;
        user.avatar = picture || user.avatar;
        user.authProvider = 'google';
        await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        token,
    });
});

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    googleAuthUrl,
    googleCallback,
    getMe,
};
