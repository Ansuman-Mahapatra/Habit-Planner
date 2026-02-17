const asyncHandler = require('express-async-handler');
const Habit = require('../models/Habit');

// Helper component to recalculate streaks
const recalculateStreaks = (habit) => {
    // Sort completions by date descending
    const sortedCompletions = habit.completions
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent completion is today or yesterday to keep the streak alive
    // If we have no completions, streak is 0
    if (sortedCompletions.length === 0) {
        habit.streak = 0;
        return;
    }

    const lastCompletionDate = new Date(sortedCompletions[0].date);
    lastCompletionDate.setHours(0, 0, 0, 0);
    
    // Calculate difference in days (using floor instead of ceil for accurate day count)
    const diffTime = today - lastCompletionDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If last completion was more than 1 day ago (and not today), streak is broken (0). 
    // Wait, if I complete TODAY, streak should be at least 1.
    // Let's count backwards from the most recent completion.
    
    // Actually, let's just count consecutive days from the most recent completion date backwards.
    let streak = 0;
    let expectedDate = new Date(sortedCompletions[0].date);
    expectedDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedCompletions.length; i++) {
        const completionDate = new Date(sortedCompletions[i].date);
        completionDate.setHours(0, 0, 0, 0);

        // If this completion matches the expected consecutive date
        if (completionDate.getTime() === expectedDate.getTime()) {
            streak++;
            // Move expected date back by one day
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            // Gap found, stop counting
            break;
        }
    }

    // Now, if the most recent completion was NOT today and NOT yesterday, the CURRENT streak for the user UI should effectively be 0, 
    // but we usually store the streak value of the 'active' streak. 
    // However, for the purpose of the app, if I missed yesterday, my streak is 0 today UNTIL I complete it.
    // If I complete it today, it becomes 1.
    
    // The logic: 
    // If last completion is today: streak is correctly calculated above.
    // If last completion is yesterday: streak is correctly calculated above.
    // If last completion is older: the 'streak' stored on the object might still be the old value? 
    // No, we should update it.
    
    // The issue: If I haven't completed today yet, is my streak 5 (from yesterday) or 0? 
    // Usually it displays 5. If I don't do it today, tomorrow it becomes 0.
    // So we store the streak based on the last connected chain.
    
    // BUT, we need to know if the chain is "broken" relative to today.
    // The prompt says: "streak and longestStreak — Stored as numbers directly on the document... Updated on every markComplete operation."
    
    // So I will stick to: Calculate streak counting back from the `sortedCompletions[0]`.
    habit.streak = streak;
    
    // Update longest streak
    if (habit.streak > habit.longestStreak) {
        habit.longestStreak = habit.streak;
    }
};

// @desc    Get user habits
// @route   GET /api/habits
// @access  Private
const getHabits = asyncHandler(async (req, res) => {
    const habits = await Habit.find({ userId: req.user.id, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(habits);
});

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = asyncHandler(async (req, res) => {
    const { title, category, frequency, targetDays, reminder, color, icon } = req.body;

    if (!title || !frequency) {
        res.status(400);
        throw new Error('Please add title and frequency');
    }

    const habit = await Habit.create({
        userId: req.user.id,
        title,
        category,
        frequency,
        targetDays,
        reminder,
        color,
        icon,
    });

    res.status(201).json(habit);
});

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = asyncHandler(async (req, res) => {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
        res.status(404);
        throw new Error('Habit not found');
    }

    // Check for user
    if (habit.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedHabit);
});

// @desc    Delete habit (Soft delete)
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = asyncHandler(async (req, res) => {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
        res.status(404);
        throw new Error('Habit not found');
    }

    // Check for user
    if (habit.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    habit.isActive = false;
    await habit.save();

    res.status(200).json({ id: req.params.id });
});

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabitById = asyncHandler(async (req, res) => {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
        res.status(404);
        throw new Error('Habit not found');
    }

    if (habit.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    res.status(200).json(habit);
});

// @desc    Toggle completion for today
// @route   PATCH /api/habits/:id/complete
// @access  Private
const markComplete = asyncHandler(async (req, res) => {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
        res.status(404);
        throw new Error('Habit not found');
    }

    if (habit.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const existingCompletionIndex = habit.completions.findIndex(c => c.date === dateString);

    if (existingCompletionIndex !== -1) {
        // Toggle
        habit.completions[existingCompletionIndex].completed = !habit.completions[existingCompletionIndex].completed;
    } else {
        // Add new
        habit.completions.push({
            date: dateString,
            completed: true
        });
    }

    // Recalculate streak
    recalculateStreaks(habit);

    await habit.save();
    res.status(200).json(habit);
});

// @desc    Get aggregated stats
// @route   GET /api/habits/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
    const habits = await Habit.find({ userId: req.user.id, isActive: true });

    let totalHabits = habits.length;
    let completedToday = 0;
    let longestStreak = 0; // Across all habits

    const today = new Date().toISOString().split('T')[0];

    habits.forEach(habit => {
        // Check if completed today
        const todayCompletion = habit.completions.find(c => c.date === today && c.completed);
        if (todayCompletion) {
            completedToday++;
        }

        if (habit.longestStreak > longestStreak) {
            longestStreak = habit.longestStreak;
        }
    });

    // Calculate weekly activity for the last 7 days
    const weeklyActivity = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];

        let count = 0;
        habits.forEach(habit => {
            if (habit.completions.some(c => c.date === dateStr && c.completed)) {
                count++;
            }
        });

        weeklyActivity.push({ day: dayName, count });
    }

    res.status(200).json({
        totalHabits,
        completedToday,
        longestStreak,
        weeklyActivity
    });
});

module.exports = {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    markComplete,
    getStats
};
