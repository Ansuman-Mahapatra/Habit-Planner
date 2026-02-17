const express = require('express');
const router = express.Router();
const {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    markComplete,
    getStats
} = require('../controllers/habit.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

// Stats route must come before /:id to avoid treating 'stats' as an ID
router.route('/stats').get(getStats);
router.route('/').get(getHabits).post(createHabit);
router.route('/:id').get(getHabitById).put(updateHabit).delete(deleteHabit);
router.route('/:id/complete').patch(markComplete);

module.exports = router;
