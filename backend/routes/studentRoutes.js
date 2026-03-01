const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { logMeal, getTodayNutrition } = require('../controllers/nutritionController');
const { searchFood } = require('../controllers/nutritionSearchController');
const { logActivity, getWeeklyActivity, deleteActivity } = require('../controllers/activityController');
const { saveMoodCheckIn, saveJournalEntry, getWeeklyMood, getJournals, getMoodDashboard, deleteJournal } = require('../controllers/moodController');
const { getEvents, joinEvent, leaveEvent } = require('../controllers/wellnessController');
const { getAllZones } = require('../controllers/environmentController');
const { chat } = require('../controllers/chatController');

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
router.get('/nutrition/search', searchFood);

// Chat (Groq Wellness Bot)
router.post('/chat', chat);

// Activity
router.post('/activity/log', logActivity);
router.get('/activity/weekly', getWeeklyActivity);
router.delete('/activity/:id', deleteActivity);

// Mood
router.post('/mood/checkin', saveMoodCheckIn);
router.get('/mood/weekly', getWeeklyMood);
router.get('/mood/dashboard', getMoodDashboard);

// Journal
router.post('/mood/journal', saveJournalEntry);
router.get('/mood/journals', getJournals);
router.delete('/mood/journal/:id', deleteJournal);

// Wellness Events (Circles)
router.get('/wellness/events', getEvents);
router.post('/wellness/:eventId/join', joinEvent);
router.delete('/wellness/:eventId/leave', leaveEvent);

// Environment Zones
router.get('/environment', getAllZones);

module.exports = router;
