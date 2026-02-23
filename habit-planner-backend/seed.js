const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Habit = require('./models/Habit');

dotenv.config();

const getDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

const generateCompletions = (rate = 0.5) => {
    const completions = [];
    // generate completions for the last 60 days
    for (let i = 0; i < 60; i++) {
        if (Math.random() < rate) {
            completions.push({
                date: getDaysAgo(i),
                completed: true
            });
        }
    }
    return completions;
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');

        // Find or create test user
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            console.log('Test user not found, something is wrong since we just logged in. Creating anyway.');
            user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        }

        // Delete existing habits for this user
        await Habit.deleteMany({ userId: user._id });
        console.log('Cleared existing habits for test user');

        const habitsToinsert = [
            {
                userId: user._id,
                title: 'Morning Run 5k',
                category: 'health',
                frequency: 'daily',
                type: 'permanent',
                startDate: getDaysAgo(60),
                weeklyGoal: 80,
                color: '#10B981', // green
                icon: '🏃',
                completions: generateCompletions(0.7),
                streak: 4,
                longestStreak: 12
            },
            {
                userId: user._id,
                title: 'Read 20 Pages',
                category: 'mind',
                frequency: 'daily',
                type: 'permanent',
                startDate: getDaysAgo(120),
                weeklyGoal: 100,
                color: '#3B82F6', // blue
                icon: '📚',
                completions: generateCompletions(0.9),
                streak: 15,
                longestStreak: 30
            },
            {
                userId: user._id,
                title: 'Deep Work Block',
                category: 'work',
                frequency: 'daily',
                type: 'permanent',
                startDate: getDaysAgo(45),
                weeklyGoal: 70,
                color: '#8B5CF6', // purple
                icon: '💻',
                completions: generateCompletions(0.5),
                streak: 0,
                longestStreak: 5
            },
            {
                userId: user._id,
                title: 'No Sugar',
                category: 'health',
                frequency: 'daily',
                type: 'temporary',
                startDate: getDaysAgo(10),
                endDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0], // 20 days in future
                weeklyGoal: 100,
                color: '#EF4444', // red
                icon: '🍬',
                completions: generateCompletions(0.8).filter(c => c.date >= getDaysAgo(10)), // Only past 10 days
                streak: 2,
                longestStreak: 4
            },
            {
                userId: user._id,
                title: 'Call Parents',
                category: 'social',
                frequency: 'custom',
                customDates: [],
                repeatEvery: 1,
                repeatUnit: 'weeks',
                type: 'permanent',
                startDate: getDaysAgo(60),
                weeklyGoal: 100,
                color: '#F59E0B', // orange
                icon: '📞',
                completions: generateCompletions(0.2), // sparse completions
                streak: 1,
                longestStreak: 2
            }
        ];

        await Habit.insertMany(habitsToinsert);
        console.log('Successfully seeded 5 rich habits for the user');

        process.exit(0);
    } catch (error) {
        console.error('Error with seed data:', error);
        process.exit(1);
    }
};

seedData();
