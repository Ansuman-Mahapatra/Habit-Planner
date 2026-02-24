const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal');

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
});

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = asyncHandler(async (req, res) => {
    const { name, description, startDate, endDate } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Please add a goal name');
    }

    const goal = await Goal.create({
        user: req.user.id,
        name,
        description,
        startDate,
        endDate
    });

    res.status(201).json(goal);
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await goal.remove();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
};
