const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { logMeal, getTodayNutrition } = require('../controllers/nutritionController');
const { logActivity, getWeeklyActivity } = require('../controllers/activityController');
const { saveMoodCheckIn, saveJournalEntry, getWeeklyMood, getJournals } = require('../controllers/moodController');
const { getEvents, joinEvent, leaveEvent } = require('../controllers/wellnessController');

// Apply auth constraints to all student routes
router.use(verifyToken);
router.use(requireRole('STUDENT'));

// Dashboard
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Welcome to the Student Dashboard' });
});

// Nutrition
router.post('/nutrition/log', logMeal);
router.get('/nutrition/today', getTodayNutrition);

// Activity
router.post('/activity/log', logActivity);
router.get('/activity/weekly', getWeeklyActivity);

// Mood
router.post('/mood/checkin', saveMoodCheckIn);
router.get('/mood/weekly', getWeeklyMood);

// Journal
router.post('/mood/journal', saveJournalEntry);
router.get('/mood/journals', getJournals);

// Wellness Events (Circles)
router.get('/wellness/events', getEvents);
router.post('/wellness/:eventId/join', joinEvent);
router.delete('/wellness/:eventId/leave', leaveEvent);

module.exports = router;
