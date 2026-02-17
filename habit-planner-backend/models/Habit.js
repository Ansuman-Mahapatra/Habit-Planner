const mongoose = require('mongoose');

const completionSchema = mongoose.Schema({
    date: {
        type: String, // YYYY-MM-DD format
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const habitSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            default: 'General'
        },
        frequency: {
            type: String,
            required: true,
            enum: ['daily', 'weekly', 'monthly', 'custom']
        },
        targetDays: {
            type: [String], // ["Mon", "Wed", "Fri"] - only for weekly
            default: []
        },
        targetWeeks: {
            type: [String], // ["Week 1", "Week 3"] - only for monthly
            default: []
        },
        customDates: {
            type: [String], // ["2024-02-14", "2024-02-20"] - only for custom
            default: []
        },
        completions: [completionSchema],
        streak: {
            type: Number,
            default: 0
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        reminder: {
            type: String, // "08:00 AM"
            default: null
        },
        color: {
            type: String,
            default: '#7C6FFF'
        },
        icon: {
            type: String,
            default: '📝'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
