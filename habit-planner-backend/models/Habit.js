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
            enum: ['daily', 'weekly', 'monthly', 'custom', 'times_per_month']
        },
        timesPerMonth: {
            type: Number,
            default: 1
        },
        goalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal',
            default: null
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
        // Frontend integration fields
        type: {
            type: String,
            default: 'permanent',
            enum: ['permanent', 'temporary']
        },
        startDate: {
            type: String, // YYYY-MM-DD
            default: () => new Date().toISOString().split('T')[0]
        },
        endDate: {
            type: String
        },
        weeklyGoal: {
            type: Number,
            default: 100
        },
        note: {
            type: String
        },
        repeatEvery: {
            type: Number
        },
        repeatUnit: {
            type: String,
            enum: ['days', 'weeks']
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
