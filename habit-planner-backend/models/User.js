const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            // Password is not required for Google OAuth users
        },
        googleId: {
            type: String,
            // Store Google's unique ID for the user
        },
        avatar: {
            type: String,
            // Store profile picture URL from Google
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    // Skip password check for Google users
    if (this.authProvider === 'google') {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    // Only hash password for local auth users
    if (!this.isModified('password') || this.authProvider === 'google') {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
